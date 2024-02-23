// @ts-nocheck
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Table({ schedules }) {
  return (
    <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-100 p-2 pt-0">
                {/* <div className="md:hidden">
                    {schedules?.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="mb-2 w-full rounded-md bg-white p-4"
                        >
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <div className="mb-2 flex items-center">
                                        <Image
                                            src={invoice.image_url}
                                            className="mr-2 rounded-full"
                                            width={28}
                                            height={28}
                                            alt={`${invoice.name}'s profile picture`}
                                        />
                                        <p>{invoice.name}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{invoice.email}</p>
                                </div>
                                <InvoiceStatus status={invoice.status} />
                            </div>
                            <div className="flex w-full items-center justify-between pt-4">
                                <div>
                                    <p className="text-xl font-medium">
                                        {formatCurrency(invoice.amount)}
                                    </p>
                                    <p>{formatDateToLocal(invoice.date)}</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <UpdateInvoice id={invoice.id} />
                                    <DeleteInvoice id={invoice.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                <table className="min-w-full text-gray-900 table">
                    <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                Schedule Type
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Schedule name
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Start time
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                End time
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Status
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Frequency
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {schedules?.map((invoice) => (
                            <tr
                                key={invoice.id}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                            >
                                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                    <div className="flex items-center gap-3">
                                        {/* <Image
                                            src={invoice.image_url}
                                            className="rounded-full"
                                            width={28}
                                            height={28}
                                            alt={`${invoice.name}'s profile picture`}
                                        /> */}
                                        <p>{invoice.name}</p>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {invoice.email}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {invoice.amount}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {invoice.date}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {invoice.status}
                                    {/* <InvoiceStatus status={invoice.status} /> */}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {invoice.frequency}
                                    {/* <InvoiceStatus status={invoice.status} /> */}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                        href={`/dashboard/schedule`}
                                        className="rounded-md border p-2 hover:bg-gray-100"
                                        >
                                        <PencilIcon className="w-5" />
                                        </Link>
                                        <Link
                                        href={`/dashboard/schedule`}
                                        className="rounded-md border p-2 hover:bg-gray-100"
                                        >
                                        <TrashIcon className="w-5" />
                                        </Link>
                                        {/* <UpdateInvoice id={invoice.id} />
                                        <DeleteInvoice id={invoice.id} /> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
