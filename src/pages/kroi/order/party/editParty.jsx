import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { changePartyNumber, getPartyById, patchParty } from '../../../../store/kroi/order';
import Title from '../../../../components/ui/title';
import PartyAmountTable from '../components/tables/partyAmountTable';
import ConsumablesTable from '../components/tables/consumablesTable';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import Button from '../../../../components/ui/button';
import { toast } from 'react-toastify';
import TextInputForTable from '../../../../components/ui/inputs/textInputForTable';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

const PrintableReport = React.forwardRef((props, ref) => {
  const { party, party_amounts, party_status, setParty } = props;

  return (
      <div ref={ref} className='flex flex-col gap-y-10 bg-white rounded-lg p-4'>
        <div className='flex gap-x-16 items-center border-b border-borderGray py-2'>
            <div className='flex items-center gap-x-4'>
                <span className='text-base font-semibold font-inter'>Заказ</span>
                <span className='text-base font-semibold font-inter text-fprimary'>№ {party?.order}</span>
                <span className='text-base font-semibold font-inter'> партия</span>
                <span>
                    <TextInputForTable
                        placeholder={'№ партии'}
                        width={'100px'}
                        value={party?.number}
                        onChange={(e) => setParty(e.target.value)}
                    />
                </span>
            </div>
            <div className='flex items-center gap-x-6'>
                <span className='text-base font-semibold font-inter'>
                    Товар: 
                    <span className='text-fprimary ml-3'>{party?.nomenclature?.title}</span>
                </span>
                <span className='text-base font-semibold font-inter'>
                    Артикул: 
                    <span className='text-fprimary ml-3'>{party?.nomenclature?.vendor_code}</span>
                </span>
            </div>
        </div>

        <PartyAmountTable data={party_amounts} status={party_status} />

        <ConsumablesTable status={party_status} />

      </div>
  );
});

const EditParty = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const printRef = useRef();

  const { party, party_status, party_amounts, party_consumables } = useSelector(state => state.kroi_order);

  useEffect(() => {
    dispatch(getPartyById({ id }))
  }, [id]);

  const setParty = (e) => {
    dispatch(changePartyNumber({ value: e }))
  }

  const validateField = () => {
    if(!party.number && id) {
      console.log(party.number)
      return false;
    }
    return true;
  }

  const onSubmit = () => {
    if(validateField()) {
        const new_party = {
          order: Number(party.order),
          nomenclature: party.nomenclature.id,
          number: party.number,
          details: party_amounts.flatMap(item => (
            item.sizes.map(sizeData => ({
              color: item.color.id,
              size: sizeData.size.id,
              plan_amount: sizeData.plan_amount,
              true_amount: Number(sizeData.true_amount)
            }))
          )),
          consumptions: party_consumables
            .filter(item => item.nomenclature)  // Отфильтровываем элементы без nomenclature
            .map(item => ({
              nomenclature: item.nomenclature,
              consumption: Number(item.consumption),
              defect: Number(item.defect),
              left: Number(item.left)
            }))
        
        }
        dispatch(patchParty({ id, props: new_party })).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast.success('Партия успешно изменена!');
            navigate(-1)
          }
        })
      } else {
        toast.error('Заполните поле № партии!')
      }
  }

  const handlePrint = useReactToPrint({
    documentTitle: `Отчёт о партии`,
    contentRef: printRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial;
        }
      }
    `
  });

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <div className='flex justify-between items-center'>
          <Title text={`Редактирование партии № ${party?.number}`}/>
          <Button 
            onClick={handlePrint} 
            className='w-max px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Print className='mr-2'/>
            Распечатать
          </Button>
        </div>
        
        <PrintableReport ref={printRef} party={party} party_amounts={party_amounts} party_status={party_status} setParty={setParty}/>
        <div className='flex justify-center'>
            <Button width='180px' onClick={onSubmit}>Сохранить</Button>
        </div>
    </div>
  )
}

export default EditParty
