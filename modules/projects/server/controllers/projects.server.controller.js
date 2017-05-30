'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
  var project = new Project(req.body);
  project.created_by = req.user;
  // project.deadline = new Date();

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var project = req.project ? req.project.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  project.isCurrentUserOwner = req.user && project.user && project.user._id.toString() === req.user._id.toString();

  res.jsonp(project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
  var project = req.project;

  project = _.extend(project, req.body);

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
  var user = req.user;

  Project.find({$or:[{ team_member: user._id }, {project_owners : user._id}]}).sort('-created').populate('created_by', 'displayName profileImageURL designation roles').populate('team_member', 'displayName profileImageURL designation roles').populate('project_owners', 'displayName profileImageURL designation roles').exec(function(err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(projects);
    }
  });
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  Project.findById(id).populate('created_by', 'displayName profileImageURL designation').populate('team_member', 'displayName profileImageURL designation roles').populate('project_owners', 'displayName profileImageURL designation roles').
  populate({
    path: 'comments',
    populate: { path: 'project user', select: 'name displayName profileImageURL designation' }
  }).exec(function (err, project) {
    if (err) {
      return next(err);
    } else if (!project) {
      return res.status(404).send({
        message: 'No Project with that identifier has been found'
      });
    }
    req.project = project;
    next();
  });
};

/**
 * Upload project files
 */

 exports.projectFileUpload = function(req, res){
   var user = req.user;
   var project = req.project ;

   var multerConfig = config.uploads.project_files.files;
   var upload = multer(multerConfig).array('newProjectFile', 4);

   if (project) {
    //  existingImageUrl = user.profileImageURL;
     uploadFile()
       .then(updateProject)
       .then(function () {
         res.json(project);
       })
       .catch(function (err) {
         res.status(422).send(err);
       });
   } else {
     res.status(401).send({
       message: 'User is not signed in'
     });
   }

   function uploadFile () {
     return new Promise(function (resolve, reject) {
       upload(req, res, function (uploadError) {
         if (uploadError) {
           reject(errorHandler.getErrorMessage(uploadError));
         } else {
           resolve();
         }
       });
     });
   }

   function updateProject () {
     return new Promise(function (resolve, reject) {
       project.project_files_url = config.uploads.project_files.files.dest + req.file.filename;
       project.save(function (err, theproject) {
         if (err) {
           reject(err);
         } else {
           resolve();
         }
       });
     });
   }



 };
