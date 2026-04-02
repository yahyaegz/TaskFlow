const sortColumns = {
  createdAt: 't.created_at',
  dueDate: 't.due_date',
  priority: 'priority_weight',
};

const priorityWeightCase = `
  CASE t.priority
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
    ELSE 4
  END
`;

class TaskRepository {
  constructor(pool) {
    this.pool = pool;
  }

  mapTask(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      categoryId: row.category_id,
      assigneeId: row.assignee_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date,
      completed: row.completed,
      completedAt: row.completed_at,
      position: row.position,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: row.tags || [],
      subtaskStats: {
        total: parseInt(row.total_subtasks || 0),
        completed: parseInt(row.completed_subtasks || 0)
      }
    };
  }

  async createTask(userId, data) {
    const status = data.status || 'todo';
    const completed = status === 'done';
    const completedAt = completed ? 'NOW()' : 'NULL';

    const query = `
      WITH input_data AS (
        SELECT $4::VARCHAR as task_status, $8::UUID as task_user_id
      )
      INSERT INTO tasks (
        title, 
        description, 
        priority, 
        status, 
        due_date, 
        category_id, 
        assignee_id, 
        user_id, 
        position,
        completed,
        completed_at
      )
      SELECT 
        $1::VARCHAR, 
        $2::TEXT, 
        $3::VARCHAR, 
        task_status, 
        $5::DATE, 
        $6::UUID, 
        $7::UUID, 
        task_user_id, 
        (SELECT COALESCE(MAX(position), -1) + 1 FROM tasks WHERE user_id = task_user_id AND status = task_status),
        $9::BOOLEAN,
        ${completedAt}
      FROM input_data
      RETURNING *
    `;
    
    const values = [
      data.title, 
      data.description || null, 
      data.priority || 'medium', 
      status, 
      data.dueDate || null, 
      data.categoryId || null, 
      data.assigneeId || null, 
      userId,
      completed
    ];
    
    const { rows } = await this.pool.query(query, values);
    return this.mapTask(rows[0]);
  }

  async findAll(userId, filters) {
    const values = [userId];
    const whereClauses = [`t.user_id = $1::UUID`];

    if (filters.status && filters.status !== 'all') {
      values.push(filters.status);
      whereClauses.push(`t.status = $${values.length}::VARCHAR`);
    }

    if (filters.categoryId) {
      values.push(filters.categoryId);
      whereClauses.push(`t.category_id = $${values.length}::UUID`);
    }

    if (filters.priority) {
      values.push(filters.priority);
      whereClauses.push(`t.priority = $${values.length}::VARCHAR`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      whereClauses.push(`t.title ILIKE $${values.length}::VARCHAR`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    let sortSql;
    if (filters.sort === 'priority') {
      sortSql = priorityWeightCase;
    } else {
      sortSql = sortColumns[filters.sort] || 't.created_at';
    }
    
    const orderSql = filters.order === 'asc' ? 'ASC' : 'DESC';
    const nullsSql = filters.sort === 'dueDate' ? ' NULLS LAST' : '';

    const query = `
      SELECT t.*, 
             COALESCE(
               json_agg(
                 json_build_object('id', tg.id, 'name', tg.name, 'color', tg.color)
               ) FILTER (WHERE tg.id IS NOT NULL), 
               '[]'
             ) as tags,
             ${priorityWeightCase} as priority_weight,
             (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) as total_subtasks,
             (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND completed = true) as completed_subtasks
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tg ON tt.tag_id = tg.id
      ${whereSql}
      GROUP BY t.id
      ORDER BY ${sortSql} ${orderSql}${nullsSql}, t.created_at DESC
    `;

    const { rows } = await this.pool.query(query, values);
    return rows.map(row => this.mapTask(row));
  }

  async findById(userId, id) {
    const query = `
      SELECT t.*,
             (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) as total_subtasks,
             (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND completed = true) as completed_subtasks
      FROM tasks t
      WHERE t.id = $1::UUID AND t.user_id = $2::UUID
    `;
    const { rows } = await this.pool.query(query, [id, userId]);
    return this.mapTask(rows[0]);
  }

  async updateTask(userId, id, data) {
    const fields = [];
    const values = [];

    const updateField = (dbField, value, type) => {
      values.push(value);
      fields.push(`${dbField} = $${values.length}::${type}`);
    };

    if (Object.prototype.hasOwnProperty.call(data, 'title')) {
      updateField('title', data.title, 'VARCHAR');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'description')) {
      updateField('description', data.description, 'TEXT');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'priority')) {
      updateField('priority', data.priority, 'VARCHAR');
    }

    // Handle status and completion synchronization
    if (Object.prototype.hasOwnProperty.call(data, 'status')) {
      updateField('status', data.status, 'VARCHAR');
      if (data.status === 'done') {
        updateField('completed', true, 'BOOLEAN');
        fields.push(`completed_at = NOW()`);
      } else {
        updateField('completed', false, 'BOOLEAN');
        fields.push(`completed_at = NULL`);
      }
    } else if (Object.prototype.hasOwnProperty.call(data, 'completed')) {
      updateField('completed', data.completed, 'BOOLEAN');
      if (data.completed) {
        updateField('status', 'done', 'VARCHAR');
        fields.push(`completed_at = NOW()`);
      } else {
        updateField('status', 'todo', 'VARCHAR');
        fields.push(`completed_at = NULL`);
      }
    }

    if (Object.prototype.hasOwnProperty.call(data, 'categoryId')) {
      updateField('category_id', data.categoryId || null, 'UUID');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'assigneeId')) {
      updateField('assignee_id', data.assigneeId || null, 'UUID');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'dueDate')) {
      updateField('due_date', data.dueDate || null, 'DATE');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'position')) {
      updateField('position', data.position, 'INTEGER');
    }

    if (fields.length === 0) return this.findById(userId, id);

    values.push(id);
    values.push(userId);

    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length - 1}::UUID AND user_id = $${values.length}::UUID
      RETURNING *
    `;

    const { rows } = await this.pool.query(query, values);
    return this.mapTask(rows[0]);
  }

  async deleteTask(userId, id) {
    const { rowCount } = await this.pool.query('DELETE FROM tasks WHERE id = $1::UUID AND user_id = $2::UUID', [id, userId]);
    return rowCount > 0;
  }

  async getStats(userId) {
    const query = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE completed = false)::int AS pending,
        COUNT(*) FILTER (WHERE completed = true)::int AS completed
      FROM tasks
      WHERE user_id = $1::UUID
    `;

    const { rows } = await this.pool.query(query, [userId]);
    return rows[0];
  }

  async findAllRaw(userId) {
    const query = `
      SELECT t.*, c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1::UUID
      ORDER BY t.created_at DESC
    `;
    const { rows } = await this.pool.query(query, [userId]);
    return rows;
  }
}

module.exports = TaskRepository;

