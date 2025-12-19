import { Router } from 'express'
import * as gameService from '../services/gameService.js'
import * as stationService from '../services/stationService.js'
import * as bookingService from '../services/bookingService.js'
import { gameSchema } from '../schemas/gameSchema.js'
import { stationSchema } from '../schemas/stationSchema.js'
import { bookingSchema } from '../schemas/bookingSchema.js'
import { validate } from '../middlewares/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// Home page
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [gamesCount, stationsCount, bookingsCount] = await Promise.all([
      gameService.count(),
      stationService.count(),
      bookingService.count(),
    ])

    res.render('pages/home', {
      gamesCount,
      stationsCount,
      bookingsCount,
    })
  })
)

// ================== GAMES ROUTES ==================

// Games list
router.get(
  '/games',
  asyncHandler(async (req, res) => {
    const games = await gameService.findAllSimple()
    res.render('pages/games/list', { games })
  })
)

// New game form
router.get('/games/new', (req, res) => {
  res.render('pages/games/form', { game: null })
})

// Create game
router.post(
  '/games/new',
  validate(gameSchema),
  asyncHandler(async (req, res) => {
    if (res.locals.errors) {
      return res.render('pages/games/form', {
        game: null,
        errors: res.locals.errors,
        formData: res.locals.formData,
      })
    }

    await gameService.create(req.body)
    res.redirect('/games')
  })
)

// Game detail
router.get(
  '/games/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(404).render('pages/error', {
        title: 'Jeu non trouve',
        message: `ID invalide.`,
      })
    }

    try {
      const game = await gameService.findById(id)
      res.render('pages/games/detail', { game })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Edit game form
router.get(
  '/games/:id/edit',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const game = await gameService.findById(id)
      res.render('pages/games/form', { game })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Update game
router.post(
  '/games/:id/edit',
  validate(gameSchema),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const game = await gameService.findById(id)

      if (res.locals.errors) {
        return res.render('pages/games/form', {
          game,
          errors: res.locals.errors,
          formData: res.locals.formData,
        })
      }

      await gameService.update(id, req.body)
      res.redirect('/games')
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Delete game
router.post(
  '/games/:id/delete',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await gameService.remove(id)
    res.redirect('/games')
  })
)

// ================== STATIONS ROUTES ==================

// Stations list
router.get(
  '/stations',
  asyncHandler(async (req, res) => {
    const stations = await stationService.findAllSimple()
    res.render('pages/stations/list', { stations })
  })
)

// New station form
router.get('/stations/new', (req, res) => {
  res.render('pages/stations/form', { station: null })
})

// Create station
router.post(
  '/stations/new',
  validate(stationSchema),
  asyncHandler(async (req, res) => {
    if (res.locals.errors) {
      return res.render('pages/stations/form', {
        station: null,
        errors: res.locals.errors,
        formData: res.locals.formData,
      })
    }

    await stationService.create(req.body)
    res.redirect('/stations')
  })
)

// Station detail
router.get(
  '/stations/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(404).render('pages/error', {
        title: 'Station non trouvee',
        message: `ID invalide.`,
      })
    }

    try {
      const station = await stationService.findById(id)
      res.render('pages/stations/detail', { station })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Edit station form
router.get(
  '/stations/:id/edit',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const station = await stationService.findById(id)
      res.render('pages/stations/form', { station })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Update station
router.post(
  '/stations/:id/edit',
  validate(stationSchema),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const station = await stationService.findById(id)

      if (res.locals.errors) {
        return res.render('pages/stations/form', {
          station,
          errors: res.locals.errors,
          formData: res.locals.formData,
        })
      }

      await stationService.update(id, req.body)
      res.redirect('/stations')
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Delete station
router.post(
  '/stations/:id/delete',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await stationService.remove(id)
    res.redirect('/stations')
  })
)

// ================== BOOKINGS ROUTES ==================

// Bookings list
router.get(
  '/bookings',
  asyncHandler(async (req, res) => {
    const bookings = await bookingService.findAllSimple()
    res.render('pages/bookings/list', { bookings })
  })
)

// New booking form
router.get(
  '/bookings/new',
  asyncHandler(async (req, res) => {
    const [stations, users] = await Promise.all([
      stationService.findAllSimple(),
      bookingService.getAllUsers(),
    ])
    res.render('pages/bookings/form', { booking: null, stations, users })
  })
)

// Create booking
router.post(
  '/bookings/new',
  validate(bookingSchema),
  asyncHandler(async (req, res) => {
    const [stations, users] = await Promise.all([
      stationService.findAllSimple(),
      bookingService.getAllUsers(),
    ])

    if (res.locals.errors) {
      return res.render('pages/bookings/form', {
        booking: null,
        stations,
        users,
        errors: res.locals.errors,
        formData: res.locals.formData,
      })
    }

    try {
      await bookingService.create(req.body)
      res.redirect('/bookings')
    } catch (error) {
      if (error.status === 409) {
        return res.render('pages/bookings/form', {
          booking: null,
          stations,
          users,
          conflictError: error.message,
          formData: res.locals.formData,
        })
      }
      throw error
    }
  })
)

// Edit booking form
router.get(
  '/bookings/:id/edit',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const [booking, stations, users] = await Promise.all([
        bookingService.findById(id),
        stationService.findAllSimple(),
        bookingService.getAllUsers(),
      ])
      res.render('pages/bookings/form', { booking, stations, users })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Reservation non trouvee',
          message: `La reservation avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Update booking
router.post(
  '/bookings/:id/edit',
  validate(bookingSchema),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const [booking, stations, users] = await Promise.all([
        bookingService.findById(id),
        stationService.findAllSimple(),
        bookingService.getAllUsers(),
      ])

      if (res.locals.errors) {
        return res.render('pages/bookings/form', {
          booking,
          stations,
          users,
          errors: res.locals.errors,
          formData: res.locals.formData,
        })
      }

      await bookingService.update(id, req.body)
      res.redirect('/bookings')
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Reservation non trouvee',
          message: `La reservation avec l'ID ${id} n'existe pas.`,
        })
      }
      if (error.status === 409) {
        const [stations, users] = await Promise.all([
          stationService.findAllSimple(),
          bookingService.getAllUsers(),
        ])
        return res.render('pages/bookings/form', {
          booking: { id, ...req.body },
          stations,
          users,
          conflictError: error.message,
          formData: res.locals.formData,
        })
      }
      throw error
    }
  })
)

// Delete booking
router.post(
  '/bookings/:id/delete',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await bookingService.remove(id)
    res.redirect('/bookings')
  })
)

export default router
