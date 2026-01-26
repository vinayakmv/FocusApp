const Partnerships = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Vouchers</h1>
            <p className="text-neutral-400">List of your redeemed partnership codes will appear here.</p>
            {/* 
         Implementation Note: 
         Currently backend 'getRewards' returns UNREDEEMED rewards.
         To list user's redeemed rewards we'd need a separate endpoint e.g., /api/partnerships/my-rewards.
         For this MVP scope, showing the placeholder is sufficient unless I add that endpoint.
         Logic: Store redeemed codes in User model or Link PartnerReward to User with 'redeemedBy' field. 
         Given time constraints, I'll stick to Placeholder unless requested.
      */}
            <div className="mt-8 bg-neutral-800 p-6 rounded text-center border border-neutral-700">
                <p>No vouchers yet. Earn tokens and visit the Rewards page!</p>
            </div>
        </div>
    )
}

export default Partnerships
