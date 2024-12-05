import React, { useState } from 'react'
import { Uploader } from 'rsuite';
import Button from '../../../../components/ui/button';
import { CloudUpload } from 'lucide-react';

const UploaderFiles = ({ data, setData }) => {

  const [files, setFiles] = useState(data);


  return (
    <div>
        <Uploader fileList={files} onChange={setFiles} autoUpload={false}>
            <Button>
                <CloudUpload className='mr-2' size={18}/>
                Загрузите файл или изображение
            </Button>
        </Uploader>
    </div>
  )
}

export default UploaderFiles
