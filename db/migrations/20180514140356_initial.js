
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('houses', function(table) {
      table.increments('id').primary()
      table.string('name')
      table.string('founder')
      table.string('house_head')
      table.string('colors')
      table.string('ghost')
      table.string('common_room')
      table.timestamps(true, true)
    }),

    knex.schema.createTable('characters', function(table) {
      table.increments('id').primary()
      table.string('name')
      table.string('birthday')
      table.string('patronus')
      table.string('parents')
      table.string('skills')
      table.string('hobbies')
      table.string('blood')
      table.string('wand')
      table.string('image')
      table.string('house')
      table.integer('house_id').unsigned()
      table.foreign('house_id').references('houses.id')
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('houses'),
    knex.schema.dropTable('characters')
  ]);
};
