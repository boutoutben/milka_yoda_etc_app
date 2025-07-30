const { defineConfig } = require("cypress");
const db = require("./dbAction");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      on("task", {
        async findUserByEmail(email) {
          return await db.findUserByEmail(email); 
        },
        async deleteUserByEmail(email) {
          await db.deleteUserByEmail(email)
          return null;
        },
        async findByField({table, field, fieldValue}) {
          return await db.findByField(table, field, fieldValue)
        },
        async resetDescriptAfterUpdate({table, field, fieldValue, description}) {
          return await db.resetDescriptAfterUpdate(table, field, fieldValue, description);
        },
        async deleteByField({table, field, fieldValue}) {
          await db.deleteByField(table, field, fieldValue);
          return null;
        },
        async updateAdoptAnimalStatus({id, value}) {
          await db.updateAdoptAnimalStatus(id, value);
          return null;
        },

        async clearUserPersonneldata(email) {
          await db.clearUserPersonneldata(email);
          return null;
        }
      });
    },
  },
}); 