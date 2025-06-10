import AlphabetButton from '../../components/AlphabetButtons';
import InstructionButton from '../../components/Instruction';
import TestButton from '../../components/TestButton'
import DynamicTextButtons from '../../components/DynamicTextButtons';

export default function MyApp() {
  return (
    <div>
      <h1>テスト</h1>
      <div>
        <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-100"/>
      </div>
      <div>
        <main className="p-8">
          <h1 className="text-xl mb-4">テストページ</h1>
          < TestButton label="おはよう"/>
        </main>
      </div>  

      <div className="font-sans text-center p-5">
        <h1 className="text-3xl font bold mb-8">React　コンポーネント連携デモ</h1>
        <DynamicTextButtons />
      </div>
      
      <div className="flex justify-center mt-4">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" maxLength={10} className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
            <input type="text" className="border border-gray-300 rounded p-2 mb-4 w-10"/>
          </div>
      </div>
      
    </div>
    
  );
}
