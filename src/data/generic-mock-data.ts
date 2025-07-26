import { DisputeRow, User } from "@/types";
import { format, subHours } from "date-fns";

import { faker } from '@faker-js/faker';
import { useState } from 'react'

export const mockUsers = (length = 12, status?: User['status']): User[] =>
    Array.from({ length }).map((_, i) => ({
        id: (faker.string.alpha(4) + faker.string.numeric(4) + faker.string.alpha(1)).toLowerCase(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        status: status ?? ['active', 'restricted', 'blocked'][faker.number.int({ min: 0, max: 2 })] as User['status'],
        createdAt: format(subHours(new Date(), (length - i) * 12), 'd MMMM yyyy : HH:mm:ss'),
    }));

export const mockDisputes = (length = 12, status?: DisputeRow['status']): DisputeRow[] => {
    const parties = mockUsers(faker.number.int({ min: 2, max: 3 }), 'active')

    return Array.from({ length }).map((_, i) => ({
        name: parties[0].name,
        ticket: (faker.string.alpha(4) + faker.string.numeric(4) + faker.string.alpha(1)).toLowerCase(),
        userId: parties[0].id,
        email: parties[0].email,
        amount: faker.commerce.price({ min: 700, max: 900, dec: 0 }),
        status: status ?? ['active', 'unassigned', 'resolved'][faker.number.int({ min: 0, max: 2 })] as DisputeRow['status'],
        parties,
        createdAt: format(subHours(new Date(), (length - i) * 12), 'd MMMM yyyy : HH:mm:ss'),
    }));
}

export const useMockDisputes = (length = 12, status?: DisputeRow['status']) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [originalDisputes] = useState(() => mockDisputes(length, status))
    const [filteredDisputes, setFilteredDisputes] = useState(originalDisputes)

    const search = (str: string, key?: 'name' | 'date') => {
        if (key === 'date') {
            setSelectedDate(str)

            setFilteredDisputes(
                originalDisputes.filter(
                    e => (!str || format(e.createdAt, 'd MMMM yyyy') === format(str, 'd MMMM yyyy')) &&
                        (!searchTerm || e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.ticket.includes(searchTerm))
                )
            )
        } else {
            setSearchTerm(str)

            setFilteredDisputes(
                originalDisputes.filter(
                    e => (e.name.toLowerCase().includes(str.toLowerCase()) || e.ticket.includes(str)) &&
                        (!selectedDate || format(e.createdAt, 'd MMMM yyyy') === format(selectedDate, 'd MMMM yyyy'))
                )
            )
        }
    }

    const filter = (status: DisputeRow['status']) => {
        setFilteredDisputes(
            originalDisputes.filter(e => e.status === status)
        )
    }

    return {
        disputes: filteredDisputes,
        selectedDate,
        searchTerm,
        search,
        filter,
    }
}


export const simulateDisputResolution = async (dispute: DisputeRow, recipient: User): Promise<{
    data: DisputeRow,
    recipient: User,
}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            dispute.status = 'resolved'

            resolve({
                data: dispute,
                recipient,
            })
        }, 3200);
    })
}
