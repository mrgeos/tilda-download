const axios = require('axios');

module.exports = async (req, res) => {
  const publicKey = process.env.NEXT_PUBLIC_TILDA_PUBLIC_KEY;
  const secretKey = process.env.NEXT_PUBLIC_TILDA_SECRET_KEY;
  const { projectId, selectedPages } = req.body;
  const baseUrl = 'https://api.tilda.cc';

  const getPageHtml = async (pageId) => {
    const response = await axios.get(`${baseUrl}/v1/getpagefull/`, {
      params: { publickey: publicKey, secretkey: secretKey, pageid: pageId }
    });
    return response.data.result.html;
  };

  try {
    const htmlPages = await Promise.all(
      selectedPages.map(async (pageId) => {
        const html = await getPageHtml(pageId);
        return { pageId, html };
      })
    );

    res.status(200).json(htmlPages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};