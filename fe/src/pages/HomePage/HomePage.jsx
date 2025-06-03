import React from 'react'
import { bg1, bg2, bg3, bg4, bg5, bg6, category1 } from '../../units/importImg'
import { ServiceFeatures, ServiceSteps, SlideService } from '../../components'
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { list } = useSelector(state => state.category);
  const MAX_ITEMS = 6;
  const actualList = list || [];
  const renderList = [
    ...actualList.slice(0, MAX_ITEMS),
    ...Array.from({ length: MAX_ITEMS - actualList.length }, (_, index) => ({
      id: `fake-${index}`,
      name: 'Danh mục đang cập nhật',
      image: category1,
      isFake: true,
    })),
  ];
  return (
    <div >
      <div className='mx-auto container'>
        <div class="grid grid-cols-3 gap-4 my-8">
          <div className='col-span-2 '>
            <div>
              <img src={bg1} alt="" className='h-[450px] object-fill' />
            </div>
          </div>
          <div className='flex flex-col justify-between'>
            <div>
              <img src={bg2} alt="" className='h-[200px] object-fill' />
            </div>
            <div>
              <img src={bg3} alt="" className='h-[200px] object-fill' />
            </div>
          </div>
        </div>
        <ServiceFeatures/>
        <div className='my-12'>
          <h1 className='text-xl font-bold'>Danh Mục Nổi Bật Trong Tháng</h1>
          <br />
          <div className='flex ga p-3 justify-between '>
            {renderList.map((item, index) => (
              <div
                key={item.id || index}
                className='cursor-pointer border border-[#bfbfbf] hover:border-[#ff6f3c] p-3 rounded-lg text-center max-w-[250px]'
              >
                <div>
                  <img src={item.image} alt={item.name} className='min-w-[224px] min-h-[217px]'/>
                </div>
                <p className='mt-3'>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='my-12'>
          <h1 className='text-xl font-bold'>Danh Mục Nổi Bật Trong Tháng</h1>
          <br />
          <SlideService/>
        </div>
        <div className='flex justify-between gap-3 px-20'>
          <div className='w-full'>
            <img src={bg4} alt="" className='h-[250px]'/>
          </div>
          <div className='w-full'>
            <img src={bg5} alt="" className='h-[250px]'/>
          </div>
          <div className='w-full'>
            <img src={bg6} alt="" className='h-[250px]'/>
          </div>
        </div>
      </div>
      <ServiceSteps/>
    </div>
  )
}

export default HomePage