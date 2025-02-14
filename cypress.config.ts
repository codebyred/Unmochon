import { defineConfig } from "cypress";
import { loadEnvConfig } from '@next/env'

export default defineConfig({

  e2e: {
    baseUrl:"http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env:{
    baseUrl:""
  }
});
