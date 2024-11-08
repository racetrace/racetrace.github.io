// eslint-disable-next-line react/prop-types
export default function ShadowBox({title, children}) {
    return (<div className="m-5">
          <div className="flex flex-col items-left gap-6 p-6 border border-gray-300 rounded shadow-lg">
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            {children}
          </div>
    </div>);
}