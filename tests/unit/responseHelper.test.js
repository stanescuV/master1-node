import { success, created, error } from '../../src/utils/responseHelper.js'

describe('ResponseHelper Unit Tests', () => {
  describe('success', () => {
    it('should return success response with data', () => {
      const data = { id: 1, name: 'Test' }
      const response = success(data)

      expect(response).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
      })
    })

    it('should handle null data', () => {
      const response = success(null)

      expect(response).toEqual({
        success: true,
        data: null,
      })
    })

    it('should handle array data', () => {
      const data = [1, 2, 3]
      const response = success(data)

      expect(response).toEqual({
        success: true,
        data: [1, 2, 3],
      })
    })

    it('should handle string data', () => {
      const response = success('Success message')

      expect(response).toEqual({
        success: true,
        data: 'Success message',
      })
    })
  })

  describe('created', () => {
    it('should return created response with data', () => {
      const data = { id: 1, name: 'New Item' }
      const response = created(data)

      expect(response).toEqual({
        success: true,
        data: { id: 1, name: 'New Item' },
      })
    })

    it('should have success flag set to true', () => {
      const response = created({ id: 1 })

      expect(response.success).toBe(true)
    })
  })

  describe('error', () => {
    it('should return error response with message', () => {
      const message = 'Something went wrong'
      const response = error(message)

      expect(response).toEqual({
        success: false,
        error: 'Something went wrong',
      })
    })

    it('should return error response with custom status', () => {
      const message = 'Not found'
      const response = error(message, 404)

      expect(response).toEqual({
        success: false,
        error: 'Not found',
      })
    })

    it('should have success flag set to false', () => {
      const response = error('Error message')

      expect(response.success).toBe(false)
    })

    it('should handle empty error message', () => {
      const response = error('')

      expect(response).toEqual({
        success: false,
        error: '',
      })
    })
  })
})
