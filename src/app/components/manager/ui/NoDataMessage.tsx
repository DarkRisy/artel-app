export const NoDataMessage = ({ searchTerm }: { searchTerm: string }) => (
  <div className="text-center py-12">
    <h3 className="text-xl font-medium text-white mb-2">Заказы не найдены</h3>
    <p className="text-gray-400">
      {searchTerm
        ? `Нет результатов для "${searchTerm}"`
        : 'Нет заказов, соответствующих выбранным критериям'}
    </p>
  </div>
)