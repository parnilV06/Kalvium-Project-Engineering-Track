const allowedCategories = ["bug", "deadline", "imposter", "vibe-code"]

// Keep the allowed list centralized so validation and route checks stay consistent.
var confessions = []
var nextId = 0

function validateConfessionInput(confessionData) {
  if (!confessionData) {
    return { isValid: false, statusCode: 400, message: { msg: 'bad' } }
  }

  if (!confessionData.text) {
    return { isValid: false, statusCode: 400, message: { msg: 'need text' } }
  }

  if (confessionData.text.length > 500) {
    return {
      isValid: false,
      statusCode: 400,
      message: { error: 'text too big, must be less than 500 characters long buddy' }
    }
  }

  if (confessionData.text.length <= 0) {
    return { isValid: false, statusCode: 400, message: 'too short' }
  }

  if (!allowedCategories.includes(confessionData.category)) {
    return { isValid: false, statusCode: 400, message: 'category not in stuff' }
  }

  return { isValid: true }
}

function createConfession(confessionData) {
  // Keep the challenge state in memory so the refactor stays focused on structure, not persistence.
  var newConfession = {
    id: ++nextId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }

  confessions.push(newConfession)
  console.log("added one info " + newConfession.id)
  return newConfession
}

function getAllConfessions() {
  // Sort a copy so reads do not mutate the backing store and create hidden ordering side effects.
  return confessions.slice().sort((a, b) => b.created_at - a.created_at)
}

function getConfessionById(confessionId) {
  return confessions.find(item => item.id === confessionId)
}

function getConfessionsByCategory(categoryName) {
  return confessions.filter(function(confession) { 
    return confession.category === categoryName
  }).reverse()
}

function deleteConfessionById(confessionId) {
  var confessionIndex = confessions.findIndex(item => item.id === confessionId)
  if (confessionIndex === -1) {
    return null
  }

  return confessions.splice(confessionIndex, 1)[0]
}

function isDeleteTokenValid(providedToken) {
  return providedToken === process.env.DELETE_TOKEN
}

module.exports = {
  allowedCategories,
  validateConfessionInput,
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById,
  isDeleteTokenValid
}