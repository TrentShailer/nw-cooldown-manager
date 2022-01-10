export const kGamesFeatures = new Map<number, string[]>([[21816, ["game_info", "gep_internal"]]]);

export const kGameClassIds = Array.from(kGamesFeatures.keys());

export const kWindowNames = { inGame: "in_game", prompts: "prompts" };

export const kHotkeys = {
	toggle: "nw_cooldown_manager_showhide",
	interact: "nw_cooldown_manager_interact",
	accept: "nw_cooldown_manager_accept",
	deny: "nw_cooldown_manager_deny",
};
