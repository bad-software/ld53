/**
 *
 * @param knex
 */
export async function up( knex ) {
  await knex.schema.createTable( 'users', ( table ) => {
    table.increments( 'id' )
    table.integer( 'highScore' )
    table.string( 'username' ).unique()
    table.string( 'password' )
    table.string( 'createdAt' )
    // table.string( 'updatedAt' )
  })
}

/**
 *
 * @param knex
 */
export async function down( knex ) {
  await knex.schema.dropTable( 'users' )
}
