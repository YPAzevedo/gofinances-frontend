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
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.forEach((item) => data.append(item.name, item.file));

    try {
      await api.post('/transactions/import', data, {
        headers: { 'content-type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const newFiles = files.map((item) => ({
      file: item,
      name: item.name,
      readableSize: filesize(item.size),
    })) as FileProps[];
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Import transactions</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              We only allow CSV files.
            </p>
            <button onClick={handleUpload} type="button">
              Import
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
