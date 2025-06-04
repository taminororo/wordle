import AlphabetButton from '../../components/AlphabetButton';
import Button from '../../components/Button';


export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
      <App /> {/* 呼び出せば、Appコンポーネントも表示されます */}
      
      <h1>アルファベット</h1>
      {/*<div className="grid grid-cols-2 gap-2.5">*/}
      {/*<div className="grid grid-cols-2 gap-8">*/}
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
      
      
     


      {/*</div>*/}
    </div>
    
  );
}

export function App() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
    </div>
  );
}
