const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBooking = async ({ userId, seatId, showId }) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        seatId,
        showId
      }
    });

    return {
      success: true,
      booking
    };
  } catch (error) {
    if (error.code === 'P2002') {
      return {
        success: false,
        status: 409,
        message: 'Seat is already booked'
      };
    }
    
    // Throw error to be caught by the route handler
    throw error;
  }
};

module.exports = {
  createBooking
};
