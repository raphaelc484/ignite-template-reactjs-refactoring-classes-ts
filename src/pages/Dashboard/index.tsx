import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

export function Dashboard () {

  const [foods,setFoods] = useState<IFoodPlate[]>([]);
  const [editFood, setEditFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(){
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    loadFoods()
  }, [])

  async function handleAddFood(food: Omit<IFoodPlate,"id"|"available">):Promise<void> {
    try {
      const response = await api.post('/foods',{
        ...food,
        available: true
      })
      setFoods([...foods,response.data])
    } catch (err) {
      console.log(err)
    }
  }

    async function handleUpdateFood(food:Omit<IFoodPlate,"id"|"available">):Promise<void> {
    try {
      const response = await api.put(`/foods/${editFood.id}`,{
        ...editFood,
        ...food
      });
      setFoods(
        foods.map(mappedFood => 
          mappedFood.id === editFood.id ? {...response.data} : mappedFood,  
        )
      )
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number):Promise<void> {
    try {
      await api.delete(`/foods/${id}`);
      setFoods(foods.filter(food => food.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal(): void {
    setIsModalOpen(!isModalOpen);
  }

  function toggleEditModal():void {
    setIsEditModalOpen(!isEditModalOpen)
  }

  function handleEditFood(food: IFoodPlate) {
    setEditFood(food);
    toggleEditModal();
  }
 
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
