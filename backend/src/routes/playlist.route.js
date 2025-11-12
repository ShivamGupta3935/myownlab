import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { getAllPlaylistDetails, createPlaylist, getPlaylistDetail, addProblemToPlaylist, removeProblemFromPlaylist, deletePlaylist,  } from '../controller/playlist.controller.js';

const playlistRouter = express.Router()

playlistRouter.route('/').get(isLoggedIn, getAllPlaylistDetails)

playlistRouter.route('/create').post(isLoggedIn, createPlaylist)

playlistRouter.route('/:playlistId').get(isLoggedIn, getPlaylistDetail)

playlistRouter.route('/:playlistId/add-problem').post(isLoggedIn, addProblemToPlaylist)

playlistRouter.route('/:playlistId/remove-problem').delete(isLoggedIn, removeProblemFromPlaylist)

playlistRouter.route('/:playlistId').delete(isLoggedIn, deletePlaylist)

export default playlistRouter;