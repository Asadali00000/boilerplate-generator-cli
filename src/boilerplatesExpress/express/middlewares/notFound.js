const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
};

module.exports = notFound;
