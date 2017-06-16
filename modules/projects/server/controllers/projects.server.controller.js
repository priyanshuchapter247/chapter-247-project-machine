'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  multer = require('multer'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Notification = mongoose.model('Notification'),
  notificationHandler = require(path.resolve('./modules/notifications/server/controllers/notifications.server.controller')),
  _ = require('lodash');

  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './modules/projects/client/img/files/uploads/');
    },
    filename: function (req, file, callback) {
      callback(null, Date.now()+ '-' + file.originalname );
    }
  });
  var upload = multer({ storage : storage }).any() ;



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
        // res.jsonp(project);
        console.log(project.team_member);
        console.log(project.project_owners);

        var notifyObj = {};
          notifyObj.name = 'new project add notification' ;
          notifyObj.msg = "You just added a project -" + project.name ;
          notifyObj.users = _.concat(project.project_owners,project.team_member,[req.user._id])
          notifyObj.href = "/projects/view/"+project._id;
          notifyObj.category = "Project";
          notifyObj.active = true ;

          // notificationHandler.sendNotification(notification);
          console.log(notifyObj);
          var notification = new Notification(notifyObj);

          notification.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              console.log("Successfully Notification send");
              res.jsonp(project);
            }
          });

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
  project.isCurrentUserOwner = req.user && project.created_by && project.created_by._id.toString() === req.user._id.toString();

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

  Project.find({$or:[{ team_member: user._id }, {project_owners : user._id}]})
  .sort('-created')
  .populate('created_by', 'displayName profileImageURL designation roles')
  .populate('team_member', 'displayName profileImageURL designation roles')
  .populate('project_files.upload_by', 'displayName')
  .populate('project_owners', 'displayName profileImageURL designation roles')
  .exec(function(err, projects) {
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

  Project.findById(id).populate('created_by', 'displayName profileImageURL designation')
  .populate('team_member', 'displayName profileImageURL designation roles')
  .populate('project_owners', 'displayName profileImageURL designation roles')
  .populate('project_files.upload_by', 'displayName')
  .populate({
    path: 'comments',
    populate: { path: 'project user', select: 'name displayName profileImageURL designation' }
  })
  .populate({
    path: 'tasks'
  })
  .exec(function (err, project) {
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

 exports.uploadProjectFile = function (req, res) {
   var user = req.user ;
   var id = req.params.projectId;
   console.log(id);
   console.log(user);
   upload(req,res,function(err) {
     if(err){
       return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
       });
     } else{
       req.files.forEach(function (files) {
      console.log(files.destination);

      var path = files.destination + files.filename;
      var imageName = files.originalname;
      var type = files.mimetype;
      // console.log(project);
               var fileInfo = {
               url : path,
               original_name: imageName,
               upload_by : req.user,
               file_type : type
               };

      Project.findById(req.params.projectId).exec(function(err, project){
       if(err){
         return res.status(400).send({
           message: errorHandler.getErrorMessage(err)
         });
       }else{

           project.project_files.push(fileInfo);

               project.save(function(err){
                 if(err){
                   return res.status(400).send({
                     message: errorHandler.getErrorMessage(err)
                   });
                 }else{
                       console.log('done')
                      }
                  });
                }
            });
        });
      }
   });

 };
