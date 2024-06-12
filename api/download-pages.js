const axios = require('axios');

module.exports = async (req, res) => {
  const { publicKey, secretKey, projectId, selectedPages } = req.body;

  const baseUrl = 'https://api.tilda.cc';

  const getPageHtml = async (pageId) => {
    const response = await axios.get(`${baseUrl}/v1/getpagefull/`, {
      params: { publickey: publicKey, secretkey: secretKey, pageid: pageId }
    });
    return response.data.result.html;
  };

  try {
   