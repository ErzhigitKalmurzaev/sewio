import React, { useState } from "react";
import styled from "@emotion/styled";
import { Calculator } from "lucide-react";
import { formatNumber } from "../../utils/functions/numFuncs";
import { useSelector } from "react-redux";

const StickyBox = ({ count, price }) => {
  
  const { operations, consumables, prices } = useSelector(state => state.calculation);

  const getTotal = (type) => {
    switch(type) {
      case 'payment': 
        return count * price || 0;
      case 'consumption':
        const operationsTotal = operations.reduce((total, operation) => total + Number(operation.price), 0) || 0;
        const consumablesTotal = consumables.reduce((total, consumable) => total + Number(consumable.price), 0) || 0;
        const pricesTotal = prices.reduce((total, price) => total + Number(price.price), 0) || 0;
        return (Number(operationsTotal) + Number(consumablesTotal) + Number(pricesTotal)) || 0;
      case 'total':
        return getTotal('consumption') * count || 0;
      case 'profit': 
        return getTotal('payment') - getTotal('total') || 0;
    }
  }
  
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Container>
      {isMinimized ? (
        <MinimizedButton onClick={() => setIsMinimized(false)}><Calculator/></MinimizedButton>
      ) : (
        <Box>
          <Header>
            <Title>Калькулятор</Title>
            <CloseButton onClick={() => setIsMinimized(true)}>✕</CloseButton>
          </Header>
          <Content>
            <InnerContainer>
              <Item>
                <Label>💰 Оплата клиента:</Label>
                <Value>{formatNumber(getTotal('payment'))} с</Value>
              </Item>
              <Item>
                <Label>📉 Расход на один товар:</Label>
                <Value>{formatNumber(getTotal('consumption'))} с</Value>
              </Item>
              <Item>
                <Label>📊 Общий расход:</Label>
                <Value>{formatNumber(getTotal('total'))} с</Value>
              </Item>
              <Item profit={getTotal('profit') >= 0}>
                <Label>💵 Прибыль:</Label>
                <Value>{formatNumber(getTotal('profit'))} с</Value>
              </Item>
            </InnerContainer>
          </Content>
        </Box>
      )}
    </Container>
  );
};

export default StickyBox;

const Container = styled.div`
  position: fixed;
  bottom: 30px;
  right: 10px;
  z-index: 1000;
`;

const Box = styled.div`
  width: 300px;
  background: white;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #2F4F4F;
`;

const Title = styled.div`
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

const Content = styled.div`
  /* padding: 15px; */
  font-size: 14px;
`;

const MinimizedButton = styled.button`
  background: #2F4F4F;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const InnerContainer = styled.div`
  display: grid;
  gap: 10px;
  background: #f9f9f9;
  padding: 10px 5px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 6px;
  background: ${({ profit }) => (profit !== undefined ? (profit ? "#d4f4dd" : "#f4d4d4") : "white")};
  border-radius: 6px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

const Value = styled.span`
  font-weight: 600;
  color: #007bff;
`;