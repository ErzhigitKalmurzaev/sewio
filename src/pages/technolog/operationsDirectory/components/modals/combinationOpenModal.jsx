import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeCombinationValue, getCombinationById, getFolderList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';

const CombinationOpenModal = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { combination, combination_status, folders_list } = useSelector(state => state.operation);

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if(modals.id) {
        dispatch(getCombinationById({ id: modals.id }))
    }
    if(!folders_list) {
        dispatch(getFolderList())
    }
  }, [modals.id])

  const getValue = (e, name) => {
    setChanged(true);
    dispatch(changeCombinationValue({ name, value: e }))
  }

  return (
    <Modal open={modals?.combination} onClose={() => setModals({ ...modals, combination: false})}>
        {
            combination_status === 'loading' && <p>Loading...</p>
        }
        {
            combination_status === 'success' && (
                <>
                    <Modal.Header>
                        <Modal.Title>Комбинация: {combination?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col gap-y-3'>
                            <div className='flex gap-x-3'>
                                <Input
                                    label='Название'
                                    type='text'
                                    value={combination?.title}
                                    onChange={(e) => getValue(e.target.value, 'title')}
                                    error={changed && !combination?.title}
                                />

                                <Select
                                    label='Папка'
                                    data={folders_list}
                                    value={combination?.file?.id}
                                    onChange={(e) => getValue(e, 'folder')}
                                    error={changed && !combination?.folder}
                                    placeholder='Выберите папку'
                                    labelKey={'title'}
                                    valueKey={'id'}
                                />
                            </div>

                            <div>
                            {
    combination?.operations?.length > 0 && (
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Операции:</h3>
            <ul className="list-none pl-0">
                {combination.operations.map((operation, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                        <span>{index + 1}. {operation.title}</span>
                        <button 
                            className="text-red-500 hover:text-red-700"
                            // onClick={() => handleDeleteOperation(index)}
                        >
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </>
            )
        }
    </Modal>
  )
}

export default CombinationOpenModal
