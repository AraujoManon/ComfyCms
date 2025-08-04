import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.static(join(__dirname, 'public')))

// Routes API

// Obtenir la liste des templates
app.get('/api/templates', async (req, res) => {
  try {
    const templatesDir = join(__dirname, 'templates')
    const templates = []
    
    const dirs = await fs.readdir(templatesDir)
    
    for (const dir of dirs) {
      const configPath = join(templatesDir, dir, 'config.json')
      try {
        const config = JSON.parse(await fs.readFile(configPath, 'utf-8'))
        templates.push({
          ...config,
          path: `/templates/${dir}`
        })
      } catch (e) {
        console.error(`Erreur lors de la lecture du template ${dir}:`, e)
      }
    }
    
    res.json(templates)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des templates' })
  }
})

// Obtenir la liste des sections
app.get('/api/sections', async (req, res) => {
  try {
    const sectionsDir = join(__dirname, 'sections')
    const sections = []
    
    // Parcourir les catégories
    const categories = await fs.readdir(sectionsDir)
    
    for (const category of categories) {
      const categoryPath = join(sectionsDir, category)
      const sectionDirs = await fs.readdir(categoryPath)
      
      for (const sectionDir of sectionDirs) {
        const configPath = join(categoryPath, sectionDir, 'config.json')
        try {
          const config = JSON.parse(await fs.readFile(configPath, 'utf-8'))
          sections.push({
            ...config,
            category,
            path: `/sections/${category}/${sectionDir}`
          })
        } catch (e) {
          console.error(`Erreur lors de la lecture de la section ${sectionDir}:`, e)
        }
      }
    }
    
    res.json(sections)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des sections' })
  }
})

// Sauvegarder un projet
app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body
    const projectId = project.id || Date.now().toString()
    const projectPath = join(__dirname, 'data', 'projects', `${projectId}.json`)
    
    await fs.mkdir(join(__dirname, 'data', 'projects'), { recursive: true })
    await fs.writeFile(projectPath, JSON.stringify(project, null, 2))
    
    res.json({ success: true, id: projectId })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du projet' })
  }
})

// Charger un projet
app.get('/api/projects/:id', async (req, res) => {
  try {
    const projectPath = join(__dirname, 'data', 'projects', `${req.params.id}.json`)
    const project = JSON.parse(await fs.readFile(projectPath, 'utf-8'))
    res.json(project)
  } catch (error) {
    res.status(404).json({ error: 'Projet non trouvé' })
  }
})

// Liste des projets
app.get('/api/projects', async (req, res) => {
  try {
    const projectsDir = join(__dirname, 'data', 'projects')
    const files = await fs.readdir(projectsDir)
    const projects = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const project = JSON.parse(await fs.readFile(join(projectsDir, file), 'utf-8'))
        projects.push({
          id: project.id,
          name: project.name,
          modified: project.modified,
          template: project.template
        })
      }
    }
    
    res.json(projects)
  } catch (error) {
    res.json([]) // Retourner un tableau vide si le dossier n'existe pas
  }
})

// Upload d'images
app.post('/api/upload', async (req, res) => {
  try {
    const { data, filename } = req.body
    const uploadPath = join(__dirname, 'public', 'assets', 'uploads')
    
    await fs.mkdir(uploadPath, { recursive: true })
    
    // Convertir base64 en buffer
    const buffer = Buffer.from(data.split(',')[1], 'base64')
    
    // Générer un nom unique
    const uniqueName = `${Date.now()}-${filename}`
    const filePath = join(uploadPath, uniqueName)
    
    await fs.writeFile(filePath, buffer)
    
    res.json({ 
      success: true, 
      url: `/assets/uploads/${uniqueName}` 
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload' })
  }
})

// Export de projet
app.post('/api/export', async (req, res) => {
  try {
    const { html, css, js, assets, format } = req.body
    const exportId = Date.now().toString()
    const exportPath = join(__dirname, 'data', 'exports', exportId)
    
    await fs.mkdir(exportPath, { recursive: true })
    
    // Créer la structure de fichiers
    if (format === 'html') {
      // Export HTML simple
      const indexContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Exporté</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    ${html}
    <script src="js/script.js"></script>
</body>
</html>`
      
      await fs.writeFile(join(exportPath, 'index.html'), indexContent)
      await fs.mkdir(join(exportPath, 'css'), { recursive: true })
      await fs.mkdir(join(exportPath, 'js'), { recursive: true })
      await fs.writeFile(join(exportPath, 'css', 'style.css'), css || '')
      await fs.writeFile(join(exportPath, 'js', 'script.js'), js || '')
      
      // Copier les assets
      if (assets && assets.length > 0) {
        await fs.mkdir(join(exportPath, 'images'), { recursive: true })
        // Logique pour copier les assets
      }
    }
    
    res.json({ 
      success: true, 
      exportId,
      downloadUrl: `/api/download/${exportId}`
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'export' })
  }
})

// Télécharger un export
app.get('/api/download/:id', async (req, res) => {
  try {
    const exportPath = join(__dirname, 'data', 'exports', req.params.id)
    
    // Ici, on devrait créer un ZIP
    // Pour l'instant, on envoie juste l'index.html
    const indexPath = join(exportPath, 'index.html')
    res.download(indexPath)
  } catch (error) {
    res.status(404).json({ error: 'Export non trouvé' })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur ComfyCMS démarré sur http://localhost:${PORT}`)
})