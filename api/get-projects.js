const axios = require('axios');

module.exports = async (req, res) => {
  const publicKey = process.env.NEXT_PUBLIC_TILDA_PUBLIC_KEY;
  const secretKey = process.env.NEXT_PUBLIC_TILDA_SECRET_KEY;
  const baseUrl = 'https://api.tilda.cc';

  try {
    const response = await axios.get(`${baseUrl}/v1/getprojectslist/`, {
      params: { publickey: publicKey, secretkey: secretKey }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};