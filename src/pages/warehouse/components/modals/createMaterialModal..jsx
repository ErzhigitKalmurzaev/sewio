import React, { useEffect, useState } from "react";
import { Modal, Toggle } from "rsuite";
import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/inputs/input";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../../../components/ui/inputs/select";
import { materialUnits } from "../../../../utils/selectDatas/productDatas";
import { getColors, getConsumablesTitleList, postMaterial } from "../../../../store/technolog/material";
import { toast } from "react-toastify";

const CreateMaterialModal = ({ modals, setModals, setUpdate = () => {}, setID = () => {} }) => {
  const dispatch = useDispatch();

  const { colors_list } = useSelector((state) => state.material);

  useEffect(() => {
    dispatch(getColors());
  }, []);

  const [material, setMaterial] = useState({
    title: "",
    vendor_code: "",
    unit: 0,
    is_active: true,
    color: null,
    coefficient: 1,
    status: 1
  });
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
    unit: false,
    is_active: false,
    color: false,
    coefficient: false,
    status: false
  });

  const getValue = (e) => {
    const { name, value } = e.target;
    setMaterial({
      ...material,
      [name]: value,
    });
  };

  const validateField = () => {
    const newErrors = {
      title: !material.title,
      vendor_code: !material.vendor_code,
      unit: !material.unit,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = () => {
    if (validateField()) {
      dispatch(postMaterial(material)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast("Сырье создано успешно!");
          setModals({ ...modals, create: false });
          setUpdate((prev) => !prev);
          setID(res.payload.id);
          setMaterial({
            title: "",
            vendor_code: "",
            unit: 0,
            is_active: true,
            color: null,
            coefficient: 1,
            status: 1
          });
          dispatch(getConsumablesTitleList());
        }
      });
    } else {
      toast("Заполните все поля!");
    }
  };

  return (
    <Modal
      open={modals.create}
      onClose={() => setModals({ ...modals, create: false })}
      size="md"
    >
      <Modal.Header>
        <Modal.Title>Создание сырья</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-y-5">
          <div className="flex justify-between gap-x-5">
            <Input
              type="text"
              name="title"
              label="Название"
              placeholder="Введите название сырья"
              value={material.title}
              onChange={getValue}
              error={errors.title}
              className="flex-1"
            />
            <Input
              type="text"
              name="vendor_code"
              label="Артикул"
              placeholder="Введите артикул сырья"
              value={material.vendor_code}
              onChange={getValue}
              error={errors.vendor_code}
              className="flex-1"
            />
            <Select
              label="Единица измерения"
              placeholder="Выберите"
              data={materialUnits}
              value={material.unit}
              error={errors.unit}
              onChange={(e) => getValue({ target: { name: "unit", value: e } })}
              className="flex-1"
            />
          </div>

          <div className="flex justify-between gap-x-5">
            <div className="w-1/3">
              <Input
                type="number"
                name="coefficient"
                label="Коэффициент"
                placeholder="Введите коэффициент"
                value={material.coefficient}
                onChange={getValue}
                error={errors.coefficient}
              />
            </div>
            <div className="w-1/3">
              <Select
                label="Цвет"
                placeholder="Выберите"
                data={colors_list}
                value={material.color}
                error={errors.color}
                labelKey='title'
                valueKey='id'
                onChange={(e) =>
                  getValue({ target: { name: "color", value: e } })
                }
                colors={true}
              />
            </div>
            <div className="w-1/3">
              <Select
                label="Статус"
                placeholder="Выберите"
                data={[{ value: 1, label: "В крой" }, { value: 2, label: "В цех" }]}
                value={material.status}
                error={errors.status}
                onChange={(e) =>
                  getValue({ target: { name: "status", value: e } })
                }
              />
            </div>
          </div>
          <div className="w-1/3 flex items-end pb-[10px]">
            <Toggle
              checked={material.is_active}
              onChange={(e) =>
                getValue({ target: { name: "is_active", value: e } })
              }
            >
              Активный
            </Toggle>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button width="100px" onClick={onSubmit}>
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateMaterialModal;
