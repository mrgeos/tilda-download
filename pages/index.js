import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { List, Card, Button, Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  useEffect(() => {
    axios.get('/api/get-projects')
      .then(response => setProjects(response.data.result))
      .catch(error => console.error('Ошибка при получении списка проектов:', error));
  }, []);

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    axios.get('/api/get-pages-list', {
      params: { projectId }
    })
    .then(response => setPages(response.data.result))
    .catch(error => console.error('Ошибка при получении списка страниц:', error));
  };

  const handlePageSelect = (pageId) => {
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
      projectId: selectedProject,
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          {projects.map(project => (
            <Menu.Item key={project.id} onClick={() => handleProjectClick(project.id)}>
              {project.title}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Проекты</Breadcrumb.Item>
            {selectedProject && <Breadcrumb.Item>{selectedProject}</Breadcrumb.Item>}
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={pages}
              renderItem={page => (
                <List.Item>
                  <Card
                    title={page.title}
                    actions={[
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => handlePageSelect(page.id)}
                      />
                    ]}
                  >
                    {page.description}
                  </Card>
                </List.Item>
              )}
            />
            <Button type="primary" onClick={handleDownload} disabled={selectedPages.length === 0}>
              Скачать выбранные страницы
            </Button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Tilda Downloader ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default Home;