import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'SimpleTeams League App',
  projectId: '6bhzpimk',
  dataset: 'dev',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
