import React, { useState } from 'react';
import { Table, Modal, Button } from 'rsuite';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteWorkById, getWorksHistory } from '../../../../../store/foreman/order';
import { toast } from 'react-toastify';

const { Cell, HeaderCell, Column } = Table;

const WorksHistoryTable = ({ data, status }) => {
  const { orderId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteStatus, setDeleteStatus] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = () => {
    if (!selectedId) return;

    setDeleteStatus(true);
    dispatch(deleteWorkById({ id: selectedId })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Работа удалена!');
        dispatch(getWorksHistory({ product: id, order: orderId }));
      }
      setDeleteStatus(false);
      setShowConfirm(false);
      setSelectedId(null);
    });
  };

  return (
    <div className="min-h-[500px] bg-white rounded-lg">
      <Table
        data={data || []}
        loading={status === 'loading' || deleteStatus}
        height={500}
        bordered
        cellBordered
        className="rounded-lg text-xs"
      >
        <Column width={70} align="center" verticalAlign="center">
          <HeaderCell>Order ID</HeaderCell>
          <Cell><p>{orderId}</p></Cell>
        </Column>

        <Column width={70}>
          <HeaderCell>Party</HeaderCell>
          <Cell dataKey="party.number" />
        </Column>

        <Column width={120} fullText>
          <HeaderCell>Color</HeaderCell>
          <Cell>
            {(rowData) => (
              <span className="font-inter flex items-center">
                <span
                  style={{
                    backgroundColor: rowData.color?.code,
                    width: '15px',
                    height: '15px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: '5px',
                  }}
                ></span>
                {rowData.color?.title}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={70} align="center" verticalAlign="center">
          <HeaderCell>Size</HeaderCell>
          <Cell dataKey="size.title" />
        </Column>

        <Column width={120}>
          <HeaderCell>Date of creation</HeaderCell>
          <Cell>{(rowData) => <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>}</Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Date edited</HeaderCell>
          <Cell>{(rowData) => <p>{formatedToDDMMYYYY(rowData?.updated_at)}</p>}</Cell>
        </Column>

        <Column flexGrow={1} fixed="right">
          <HeaderCell>Actions</HeaderCell>
          <Cell style={{ padding: '6px' }}>
            {(rowData) => (
              <div className="flex items-center px-3 gap-x-5 py-1 cursor-pointer">
                <Pencil onClick={() => navigate(`${rowData.id}`)} />
                <Trash2
                  size={19}
                  color="#d0021b"
                  onClick={() => {
                    setSelectedId(rowData?.id);
                    setShowConfirm(true);
                  }}
                />
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      {/* Подтверждение удаления */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить эту работу?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete} appearance="primary" color="red" loading={deleteStatus}>
            Удалить
          </Button>
          <Button onClick={() => setShowConfirm(false)} appearance="subtle">
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorksHistoryTable;