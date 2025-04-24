exports.parseFhir = (req, res) => {
  // your logic to parse and handle FHIR data
  console.log(req.body); // or req.file if it's a file
  res.status(200).json({ message: 'FHIR data parsed successfully!' });
};
