import { User } from '../models/User';

export const updateUserXP = async (userId: string, xpToAdd: number) => {
    console.log(`Starting XP update for user: ${userId}, XP to add: ${xpToAdd}`);

    const user = await User.findById(userId);
    if (!user) {
        console.error("Error: User not found");
        throw new Error("User not found");
    }

    // Store the old level
    const oldLevel = user.level;

    // Add XP
    user.xp += xpToAdd;
    console.log(`Updated XP for user ${userId}: ${user.xp}`);

    // Calculate new level
    let newLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (user.xp < 100) newLevel = 'Beginner';
    else if (user.xp < 300) newLevel = 'Intermediate';
    else newLevel = 'Advanced';

    user.level = newLevel;
    console.log(`User ${userId} level updated from ${oldLevel} to ${newLevel}`);

    await user.save();
    console.log(`User ${userId} data saved successfully!`);

    // Check if user leveled up
    const hasLeveledUp = oldLevel !== newLevel;

    if (hasLeveledUp) {
        console.log(`🎉 User ${userId} leveled up to ${newLevel}!`);
    }

    // Return updated info
    return {
        newXP: user.xp,
        newLevel: newLevel,
        hasLeveledUp: hasLeveledUp
    };
};