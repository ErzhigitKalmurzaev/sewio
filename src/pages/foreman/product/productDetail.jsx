import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductCombinations, clearCombinationsList } from "../../../store/foreman/order";
import Title from "../../../components/ui/title";
import BackDrop from "../../../components/ui/backdrop";
import Button from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import ViewCombinationsTable from "./viewCombinationsTable";

const ViewProductCombinations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { combinations_list, combinations_list_status } = useSelector(state => state.foreman_order);
  const [productData, setProductData] = useState({
    title: "",
    vendor_code: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Очищаем предыдущие данные
    dispatch(clearCombinationsList());
    
    // Загружаем комбинации для продукта
    if (id) {
      dispatch(getProductCombinations(id)).then(res => {
        if (res.meta.requestStatus === 'fulfilled' && res.payload?.length > 0) {
          // Получаем информацию о товаре из первой комбинации или другого источника
          // Если у вас есть отдельный endpoint для получения инфы о продукте, используйте его
          const storedOrder = JSON.parse(localStorage.getItem('order') || '{}');
          setProductData({
            title: storedOrder.productTitle || "—",
            vendor_code: storedOrder.vendorCode || "—"
          });
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }

    return () => {
      // Очистка при размонтировании
      dispatch(clearCombinationsList());
    };
  }, [dispatch, id]);

  const sumOperationsValues = (operations, key) => {
    if (!operations || operations.length === 0) return 0;
    return operations.reduce((acc, item) => {
      const value = Number(item[key]) || 0;
      return acc + value;
    }, 0);
  };

  const totalTime = combinations_list.reduce((acc, comb) => {
    return acc + sumOperationsValues(comb.operations, 'time');
  }, 0).toFixed(2);

  const totalPrice = combinations_list.reduce((acc, comb) => {
    return acc + sumOperationsValues(comb.operations, 'price');
  }, 0).toFixed(2);

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5 mb-5">
      <div className="flex justify-between items-center">
        <Title text="Просмотр комбинаций товара" />
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" size={18} />
          Назад
        </Button>
      </div>

      <BackDrop open={isLoading || combinations_list_status === 'loading'} />

      <div className="w-full bg-white rounded-lg px-6 py-6 flex flex-col gap-y-5">
        {/* Информация о товаре */}
        <div className="flex flex-col gap-y-3 pb-4 border-b border-gray-200">
          <p className="font-inter text-lg font-semibold">Информация о товаре</p>
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-gray-500">Название:</span>
              <span className="text-base font-medium">{productData.title || "—"}</span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-gray-500">Артикул:</span>
              <span className="text-base font-medium">{productData.vendor_code || "—"}</span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm text-gray-500">Всего комбинаций:</span>
              <span className="text-base font-medium">{combinations_list?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Таблица комбинаций */}
        <div className="flex flex-col gap-y-3">
          <p className="font-inter text-lg font-semibold">Комбинации и операции</p>
          <ViewCombinationsTable
            combinations={combinations_list} 
            status={combinations_list_status} 
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProductCombinations;