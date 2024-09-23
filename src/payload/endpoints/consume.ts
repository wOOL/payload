import payload from 'payload'

export const consume = async (req, res, next): Promise<void> => {
    const { uid, amount } = req.body;
    if (!uid || !amount) {
        return res.status(400).json({ error: 'UID and amount are required' });
    }
    try {
        const user = await payload.findByID({
            collection: 'users',
            id: uid,
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            if (user.balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }
            const updatedUser = await payload.update({
                collection: 'users',
                id: uid,
                data: {
                    balance: user.balance - amount,
                },
            });
            res.status(200).json({
                message: 'Balance deducted successfully',
                newBalance: updatedUser.balance,
            });
        }
    } catch (error) {
        console.error('Something goes wrong:', error);
        return null;
    }
};