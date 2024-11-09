import React from 'react'

const FillProduct = () => {

    const [modals, setModals] = useState({ newOperation: false, newCombination: false });
    const [newCombination, setNewCombination] = useState({
        name: '',
        operations: []
    })
    const [newOperation, setNewOperation] = useState({
        title: '',
        equipment: '',

        sizes: [
        {
            size: 's',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'm',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'l',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'xl',
            time: 0,
            rank: '',
            materials: []
        },
        {
            size: 'xxl',
            time: 0,
            rank: '',
            materials: []
        }
        ]
    })
    const [createdProduct, setCreatedProduct] = useState({
        title: '',
        vendor_code: '',
        is_active: true,
        combinations: [],
        operations: []
    })

  return (
    <div>
        <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Комбинации</p>
          <Button onClick={() => setModals({ ...modals, newCombination: true })}>+ Создать комбинацию</Button>
        </div>

        {
          createdProduct.combinations.length > 0 ?
            <div className="bg-white rounded-lg">
              {
                createdProduct.combinations.map((combination, index) => (
                  <Accordion className="border-b border-borderGray rounded-0">
                    <Accordion.Panel header={combination.name}>
                      <p className="text-base font-semibold font-inter my-2">Операции</p>
                      <div className='w-full flex flex-wrap justify-between gap-4 rounded-md p-1' key={index}>
                            {
                                combination?.operations?.map((item, index) => (
                                    <div 
                                        className='w-[49%] gap-x-3 flex justify-between items-center justify-between p-2 rounded-sm py-3 bg-[#FAFAFA] cursor-pointer' 
                                        key={index} 
                                    >
                                        <p className="text-sm font-medium font-inter">{item.name}</p>
                                        <div className="pl-1">
                                          <Trash2 color="red" size={20} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Accordion.Panel>
                  </Accordion>
                ))
              }
            </div>
            :
            <p className="text-base font-semibold font-inter text-center my-5">Комбинации отсутствуют</p>
        }
      </div>

      <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Операции</p>
          <Button onClick={() => setModals({ ...modals, newOperation: true })}>+ Создать операцию</Button>
        </div>

        <div className="flex flex-col gap-y-6">
          {
            createdProduct.operations.length > 0 ?
            createdProduct.operations.map((operation, index) => (
              <OperationBlock
                key={index}
                operation={operation}
                setNewProduct={setNewProduct}
                index={index}
              />
            ))
            :
            <p className="text-base font-semibold font-inter text-center my-5">Операции отсутствуют</p>
          }
        </div>
      </div>

      {/* Модалки */}

      <NewOperation 
        open={modals.newOperation} 
        modals={modals} 
        setModals={setModals} 
        newOperation={newOperation} 
        setNewOperation={setNewOperation}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />
      <NewCombination
        open={modals.newCombination}
        modals={modals}
        setModals={setModals}
        newCombination={newCombination}
        setNewCombination={setNewCombination}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />
    </div>
  )
}

export default FillProduct
