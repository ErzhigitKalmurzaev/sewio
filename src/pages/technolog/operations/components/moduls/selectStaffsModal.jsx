import React, { useEffect, useState } from 'react'
import { Checkbox, Modal, Table } from 'rsuite';
import Button from '../../../../../components/ui/button';
import { employeeRole } from '../../../../../utils/selectDatas/employeeDatas';
import NumInput from './../../../../../components/ui/inputs/numInput';
import { useDispatch } from 'react-redux';
import { postDistOperation } from '../../../../../store/technolog/operations';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalOperationsTable from '../tables/modalOperationsTable';
import ModalStaffsModal from '../tables/modalStaffsModal';

const { Column, HeaderCell, Cell } = Table;

const SelectStaffsModal = ({ modals, setModals, staff_list, status, staffs, setStaffs, amount, setAmount, operations }) => {

  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const { id } = useParams();  
  
  const [stage, setStage] = useState(0);
  const [operationArr, setOperationArr] = useState(operations.map(item => ({ ...item, amount: '' })));

  useEffect(() => {
    setOperationArr(operations.map(item => ({ ...item, amount: '' })))
  }, [operations?.length])

  const selectStaff = (data) => {
    if(staffs.find(item => item === data)) {
      setStaffs(staffs.filter(item => item !== data))
    } else {
      setStaffs([...staffs, data])
    }
  }

  const onNext = () => {
    if(staffs.length > 0) {
      setStage(1)
    } else {
      toast.error('Выберите минимум 1го сотрудника!')
    }
  }

  const validateField = () => {
    if(!operationArr.every(item => item.amount * staffs?.length <= item?.required - item?.assigned)) {
        toast.error('Количество введенных операций не должно превышать количество оставшихся операций!')
    } else if(!operationArr.every(item => item.amount)) {
        toast.error('Заполните все поля!')
    } else {
        return true
    }
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(postDistOperation({
            order_id: Number(id),
            staff_ids: staffs,
            operations: operationArr.map(item => ({
                operation_id: item.id,
                amount: Number(item.amount)
            })),
        })).then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                setModals({ ...modals, select: false });
                navigate(-1)
                toast('Операция успешно распределена!')
            } else {
                toast.error('Произошла ошибка!')
            }
        })
    }
  }


  return (
    <Modal open={modals.select} onClose={() => setModals({ ...modals, select: false })} size='lg'>
        <Modal.Header>
            <Modal.Title>Распределение операций</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='min-h-[300px] bg-white rounded-lg flex flex-col gap-y-4'>
              <div className='border border-borderGray rounded-lg'>
                {
                    stage === 0 ?
                    <ModalStaffsModal 
                        staff_list={staff_list} 
                        status={status} 
                        staffs={staffs} 
                        selectStaff={selectStaff}
                    /> :
                    <ModalOperationsTable
                        operations={operations}
                        data={operationArr}
                        setData={setOperationArr}
                    />
                }
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-x-4'>
              {
                stage === 0 ?
                <Button width='120px' variant='white' onClick={() => setModals({ ...modals, select: false })}>
                    Отмена
                </Button> :
                <Button width='120px' variant='white' onClick={() => setStage(0)}>
                    Назад
                </Button>
              }
              {
                stage === 0 ?
                <Button width='120px' onClick={onNext}>
                  Далее
                </Button> :
                <Button width='120px' onClick={onSubmit}>
                  Подтвердить
                </Button>
              }
          </div>
        </Modal.Footer>
    </Modal>
  )
}

export default SelectStaffsModal
