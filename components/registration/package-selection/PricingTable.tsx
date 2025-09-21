"use client";

interface PricingRow {
  type: string;
  deadline: string;
  amount: string;
  games: string;
  bgColor?: string;
  textColor?: string;
}

const pricingData: PricingRow[] = [
  {
    type: "Full Season (Early Bird)",
    deadline: "Sep 24, 2025",
    amount: "$3,495",
    games: "12 + playoffs - 4 game sessions",
    bgColor: "bg-white",
    textColor: "text-gray-800",
  },
  {
    type: "Full Season",
    deadline: "Oct 5, 2025",
    amount: "$3,795",
    games: "12 + playoffs - 4 game sessions",
    bgColor: "bg-white",
    textColor: "text-gray-800",
  },
  {
    type: "Two Session Pack",
    deadline: "Oct 5, 2025",
    amount: "$1,795",
    games: "3 games per session max",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
  {
    type: "Session 1 Only",
    deadline: "Oct 5, 2025",
    amount: "$895",
    games: "3 games max",
    bgColor: "bg-gray-300",
    textColor: "text-black",
  },
  {
    type: "Session 2 Only",
    deadline: "Nov 30, 2025",
    amount: "$895",
    games: "3 games max",
    bgColor: "bg-gray-300",
    textColor: "text-black",
  },
  {
    type: "Session 3 Only",
    deadline: "Jan 4, 2026",
    amount: "$895",
    games: "3 games max",
    bgColor: "bg-gray-300",
    textColor: "text-black",
  },
  {
    type: "Session 4 Only",
    deadline: "Feb 1, 2026",
    amount: "$895",
    games: "3 games max",
    bgColor: "bg-gray-300",
    textColor: "text-black",
  },
  {
    type: "Playoffs, if eligible",
    deadline: "Mar 1, 2026",
    amount: "$895",
    games: "2 games minimum",
    bgColor: "bg-gray-600",
    textColor: "text-white",
  },
];

export function PricingTable() {
  return (
    <div className="mb-36 md:mb-44 mt-24 md:mt-36">
      <h2 className="md:text-3xl text-2xl font-bold text-center mb-12 grotesk">
        Pricing Schedule
      </h2>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr className="bg-red-800">
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-white uppercase"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
                    >
                      Deadline
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase"
                    >
                      Games
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {pricingData.map((row, index) => (
                    <tr key={index}>
                      <td
                        className={`${row.bgColor} ${row.textColor} px-6 py-4 whitespace-nowrap text-sm font-medium`}
                      >
                        {row.type}
                      </td>
                      <td
                        className={`${row.bgColor} ${row.textColor} px-6 py-4 whitespace-nowrap text-center text-sm font-medium`}
                      >
                        {row.deadline}
                      </td>
                      <td
                        className={`${row.bgColor} ${row.textColor} px-6 py-4 whitespace-nowrap text-center text-sm font-medium`}
                      >
                        {row.amount}
                      </td>
                      <td
                        className={`${row.bgColor} ${row.textColor} px-6 py-4 whitespace-nowrap text-left text-sm font-medium`}
                      >
                        {row.games}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        * All prices are in CAD. Individual session pricing applies to Session
        2, 3, and 4 at $895 each.
      </div>
    </div>
  );
}
