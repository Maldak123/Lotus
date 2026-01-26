const PageHeader = ({children}: React.PropsWithChildren) => {
  return (
    <p className="text-center text-xl font-light">
      <strong>{children}</strong>
    </p>
  )
}

export default PageHeader