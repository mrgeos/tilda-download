import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TildaDownloader = () => {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  useEffect(() => {
    // Получение списка страниц (замените на ваш метод API)
    axios.get('/api/get-pages-list')
      .then(response => setPages(response.data.result))
      .catch(error => console.error('Ошибка при получении списка страниц:', error));
  }, []);

  const handleCheckboxChange = (pageId) => {
    setSelectedPages(prevSelected => {
      if (prevSelected.includes(pageId)) {
        return prevSelected.filter(id => id !== pageId);
      } else {
        return [...prevSelected, pageId];
      }
    });
  };

  const handleDownload = () => {
    axios.post('/api/download-pages', {
      publicKey: 'your_publickey',
      secretKey: 'your_secretkey',
      projectId: 'your_project_id',
      selectedPages
    })
      .then(response => {
        response.data.forEach(({ pageId, html }) => {
          const blob = new Blob([html], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `page_${pageId}.html`;
          link.click();
        });
        alert('Страницы успешно загружены!');
      })
      .catch(error => console.error('Ошибка при загрузке страниц:', error));
  };

  return (
    <div>
      <h1>Скачивание страниц Tilda</h1>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPages.includes(page.id)}
                onChange={() => handleCheckboxChange(page.id)}
              />
              {page.title}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleDownload}>Скачать выбранные страницы</button>
    </div>
  );
};

export default TildaDownloader;