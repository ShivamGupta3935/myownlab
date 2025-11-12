import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllPlaylistDetails = asyncHandler(async (req, res) => {
   const playlists = await db.playlists.findMany({
    where: {
        userId : req.user.id
    },
    include: {
        problems: {
            include: {
                problem: true
            }
        }
    }
   })

   res.status(200).json(200, playlists, "Playlists fetched successfully")
})

const createPlaylist = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const {name, description} = req.body

    if (!userId) {
        throw new ApiError(400, "invalid user id")
    }
    if (!name || !description) {
        throw new ApiError(400, "all fields are required")
    }
    
    const playlist = await db.playlist.create({
        data: {
            name,
            description,
            userId
        }
    })

    res.status(201).json(201, playlist, "new playlist created successfully")

})

const getPlaylistDetail = asyncHandler (async(req , res) => {
    const {playlistId} = req.params

    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
            userId: req.user.id
        },
        include: {
            problems: {
                include: {
                    problem: true
                }
            }
        }
    })

    if (!playlist) {
        throw new ApiError(400, "invalid playlist id")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "playlist fetched successfully")
    )

})

const addProblemToPlaylist = asyncHandler(async(req , res) => {
    const playlistId = req.params
    const {problemIds} = req.body

    if (!playlistId || !problemIds) {
        throw new ApiError(404, 'invalid user or problem id')
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(400, "please select at least one problem")
    }

    console.log(
        problemIds.map(problemId => ({
            problemId,
            playlistId
        }))
    );
    
    const problemInPlaylist = await db.problemInPlaylist.createMany({
        data: problemIds.map((problemId) => ({
            playlistId: playlistId,
            problemId
        }))
    })

    return res.status(201).json(new ApiResponse (201, problemInPlaylist, "problem added in playlist successfully"))
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(404, "invalid playlist id")
    }

    const deletePlaylist = await db.playlist.delete({
        where: {
            id: playlistId
        }
    })

    res.status(200).json(new ApiResponse(200, {deletePlaylist}, "playlist deleted successfully"))
})

const removeProblemFromPlaylist = asyncHandler(async(req , res) => {
    const {playlistId} = req.params
    const {problemIds} = req.body

    if (!playlistId || !problemIds) {
        throw new ApiError(404, "id missing")
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(400, "No id exists")
    }

    const deleteProblem = await db.playlist.deleteMany({
        where: playlistId,
        problemId: {
            in: problemIds
        }
    })

    res.status(200).json(
        new ApiResponse(200, {deleteProblem}, "problem deleted successfully from playlist")
    )
})

export {
    removeProblemFromPlaylist,
    createPlaylist,
    addProblemToPlaylist,
    deletePlaylist,
    getAllPlaylistDetails,
    getPlaylistDetail
}