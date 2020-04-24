import React, { useState } from 'react';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [files, setFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    files.forEach((file) => data.append(file.name, file.file));

    try {
      await api.post('/transactions/import', data, {
        headers: { 'content-type': 'multipart/form-data' },
      });
      setFiles([]);
    } catch (err) {
      console.error(err.response.error);
    }
  }

  function submitFile(uploadedFiles: File[]): void {
    const newFiles = uploadedFiles.map((item) => ({
      file: item,
      name: item.name,
      readableSize: filesize(item.size),
    })) as FileProps[];
    setFiles([...files, ...newFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!files.length && <FileList files={files} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
