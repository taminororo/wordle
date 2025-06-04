import AlphabetButton from '../../components/AlphabetButton';
import Button from '../../components/Button';


export default function MyApp() {
  return (
    <div>
      
      <div className="flex justify-center mt-4">
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
          <div className="grid grid-flow-col auto-cols-max gap-2 mb-4">
            <AlphabetButton label="Q"/>
            <AlphabetButton label="W"/>
            <AlphabetButton label="E"/>
            <AlphabetButton label="R"/>
            <AlphabetButton label="T"/>
            <AlphabetButton label="Y"/>
            <AlphabetButton label="U"/>
            <AlphabetButton label="I"/>
            <AlphabetButton label="O"/>
            <AlphabetButton label="P"/>
          </div>
      </div>
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2 mb-4">
            <AlphabetButton label="A"/>
            <AlphabetButton label="S"/>
            <AlphabetButton label="D"/>
            <AlphabetButton label="F"/>
            <AlphabetButton label="G"/>
            <AlphabetButton label="H"/>
            <AlphabetButton label="J"/>
            <AlphabetButton label="K"/>
            <AlphabetButton label="L"/>
          </div>
      </div>
      
      <div className="flex justify-center">
          <div className="grid grid-flow-col auto-cols-max gap-2">
            <AlphabetButton label="Z"/>
            <AlphabetButton label="X"/>
            <AlphabetButton label="C"/>
            <AlphabetButton label="V"/>
            <AlphabetButton label="B"/>
            <AlphabetButton label="N"/>
            <AlphabetButton label="M"/>
          </div>
      </div>
      <div className="flex justify-center mt-4">
          <Button label="スタートに戻る"/>
      </div>
    </div>
    
  );
}
