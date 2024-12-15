import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import { getMateralList } from '../../../store/technolog/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RejectMaterialsTable from '../components/tables/reject/rejectMaterialsTable'
import SelectRejectMaterialModal from '../components/modals/reject/selectRejectMaterialModal'
import { Uploader } from 'rsuite';
import { CloudUpload } from 'lucide-react';
import { postRejectMaterials, postRejectMaterialsFiles } from '../../../store/warehouse/materails'
import { toast } from 'react-toastify'
import BackDrop from '../../../components/ui/backdrop'

const RejectMaterials = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
        path: '/main',
        active: false
    },
    {
        label: 'Учет брака',
        path: '/main/repleshipment',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { materials_list, materials_list_status } = useSelector(state => state.material);

  const [modals, setModals] = useState({ select: false, create: false });
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getMateralList({ title: search }))
  }, [modals.create]);

  const handleSearch = () => {
    dispatch(getMateralList({ title: search }))
  }

  const onSubmit = () => {
    const data = materials.map((material) => ({
      product_id: material.id,
      amount: Number(material.amount),
      comment: material.comment,
      price: 0
    }));
    setLoading(true)

    dispatch(postRejectMaterials({ products: data })).then(res => {
      if(res.meta.requestStatus === 'fulfilled') {
        if(files?.length > 0) {
          dispatch(postRejectMaterialsFiles({
            quantity_id: res.payload.quantity_id,
            files: files.map(item => item.blobFile)
          }))
              .then(res => {
                  if(res.meta.requestStatus === 'fulfilled') {
                      navigate(-1)
                      toast("Брак успешно оформлен!")
                      setLoading(false)
                  } else {
                      toast("Произошла ошибка!")
                      setLoading(false)
                  }
              })
        } else {
          setLoading(false);
          navigate(-1)
          toast("Брак успешно оформлен!")
        }
      } else {
        toast("Произошла ошибка!")
        setLoading(false)
      }
    })
    
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        {
            loading && <BackDrop open={loading}/>
        }
        
        <div className='flex items-center justify-between'>
            <Title text="Учет брака"/>
            <div className='2/6'>
                <Button onClick={() => setModals({ ...modals, select: true })}>+ Добавить материал</Button>
            </div>
        </div>

        <div className='mt-2'>
            <RejectMaterialsTable
                data={materials}
                setMaterials={setMaterials}
            />
        </div>

        <div className='bg-white rounded-lg flex flex-col gap-y-5 p-5'>
          <p className='text-base font-semibold font-inter'>Файлы</p>

          <Uploader
            fileList={files}
            onChange={(fileList) => setFiles(fileList)}
            autoUpload={false}
          >
            <Button>
                <CloudUpload className='mr-2' size={18} />
                Загрузите файл или изображение
            </Button>
          </Uploader>
        </div>

        <div className='flex justify-center mt-5'>
            <Button width='200px' onClick={onSubmit}>Отправить</Button>
        </div>

        <SelectRejectMaterialModal
            modals={modals}
            setModals={setModals}
            materials_list={materials_list}
            status={materials_list_status}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            materials={materials}
            setMaterials={setMaterials}
        />
    </div>
  )
}

export default RejectMaterials
