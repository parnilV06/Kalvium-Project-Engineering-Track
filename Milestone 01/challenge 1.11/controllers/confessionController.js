const confessionService = require('../services/confessionService')

function handleCreateConfession(req, res) {
  // Validate at the edge so the service only receives payloads that already match the request contract.
  var validationResult = confessionService.validateConfessionInput(req.body)

  if (!validationResult.isValid) {
    return res.status(validationResult.statusCode).json(validationResult.message)
  }

  var newConfession = confessionService.createConfession(req.body)
  return res.status(201).json(newConfession)
}

function handleGetAllConfessions(req, res) {
  var sortedConfessions = confessionService.getAllConfessions()
  var responsePayload = {
    data: sortedConfessions,
    count: sortedConfessions.length
  }

  console.log("fetching all data result")
  return res.json(responsePayload)
}

function handleGetConfessionById(req, res) {
  // Convert the id once here so the service layer only deals with the normalized value.
  var confessionId = parseInt(req.params.id)
  var confession = confessionService.getConfessionById(confessionId)

  if (confession) {
    console.log("found info with " + confession.text.length + " chars")
    return res.json(confession)
  }

  return res.status(404).json({msg: 'not found'})
}

function handleGetConfessionsByCategory(req, res) {
  var categoryName = req.params.cat

  // Reject invalid categories before reading from the store so bad routes fail without extra work.
  if (!confessionService.allowedCategories.includes(categoryName)) {
    return res.status(400).json({msg: 'invalid category'})
  }

  var filteredConfessions = confessionService.getConfessionsByCategory(categoryName)
  return res.json(filteredConfessions)
}

function handleDeleteConfession(req, res) {
  // Check authorization first because unauthorized deletes should never reach the data layer.
  if (!confessionService.isDeleteTokenValid(req.headers['x-delete-token'])) {
    return res.status(403).json({msg: 'no permission'})
  }

  if (!req.params.id) {
    return res.status(400).send('no id')
  }

  // Parse the id after basic request checks so the failure path stays easy to follow.
  var confessionId = parseInt(req.params.id)
  var deletedConfession = confessionService.deleteConfessionById(confessionId)

  if (!deletedConfession) {
    return res.status(404).json({msg: 'not found buddy'})
  }

  console.log("deleted something")
  return res.json({msg: 'ok', item: deletedConfession})
}

module.exports = {
  handleCreateConfession,
  handleGetAllConfessions,
  handleGetConfessionById,
  handleGetConfessionsByCategory,
  handleDeleteConfession
}