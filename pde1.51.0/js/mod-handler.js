var GameMods = {
        available: [{
                id: "WalkSpeed",
                patch: "initWalkSpeedMod"
        }, {
                id: "FastGameSpeed",
                patch: "initFastGameSpeedMod"
        }, {
                id: "RebalancedBattles",
                patch: "initRebalancedBattleMod"
        }]
};
class ModHandler {
        constructor(e) {
                this.game = e, this.animations = new class {
                        constructor() {
                                this.animations = []
                        }
                        getAll() {
                                let e = [];
                                for (let t = 0; t < this.animations.length; t++) e.push(this.animations[t].animation);
                                return e
                        }
                        register(e, t) {
                                this.animations.push({
                                        animation: e,
                                        baseSpeed: t
                                })
                        }
                        clear() {
                                this.animations = []
                        }
                }, this.tweens = new class {
                        constructor() {
                                this.tweens = []
                        }
                        getAll() {
                                return this.tweens
                        }
                        getTweens() {
                                let e = [];
                                for (let t = 0; t < this.tweens.length; t++) e.push(this.tweens[t].tween);
                                return e
                        }
                        register(e, t, i, a) {
                                this.tweens.push({
                                        tween: t,
                                        _parent: e,
                                        baseDelay: i,
                                        baseDuration: a
                                })
                        }
                        clear() {
                                this.tweens = []
                        }
                }
        }
        log(e) {
                Util.isDefined(e) && console.log("%c %c %c " + e + " %c %c ", "background: #1724", "background: #172a", "background: #172f; color: #FFF", "background: #172a", "background: #1724")
        }
        info(e) {
                Util.isDefined(e) && console.log("%c %c %c " + e + " %c %c ", "background: #14b4", "background: #14ba", "background: #14bf; color: #FFF", "background: #14ba", "background: #14b4")
        }
        error(e) {
                Util.isDefined(e) && console.log("%c %c %c " + e + " %c %c ", "background: #a114", "background: #a11a", "background: #a11f; color: #FFF", "background: #a11a", "background: #a114")
        }
        initWalkSpeedMod() {
                this.game.prodigy.player.walkSpeed = 1, Prodigy.Container.CreatureContainer.prototype.setPath = function(e, t, i) {
                        if (Util.isDefined(e)) {
                                this.game.tweens.removeFrom(this, !1), this.game.tweens.removeFrom(this.sprites), Util.isDefined(i) || (i = this.game.prodigy.player.walkSpeed * this.walkSpeed);
                                for (var a = null, s = null, r = this.x, o = this.y, n = e.length - 1; n >= 0; n--) {
                                        var l = e[n];
                                        Util.isDefined(l.x) || (l.x = r), Util.isDefined(l.y) || (l.y = o);
                                        var d = Phaser.Math.distance(l.x, l.y, r, o);
                                        0 !== d && (Util.isDefined(a) || (a = this.game.add.tween(this), s = this.game.add.tween(this.sprites.scale)), a.to({
                                                x: l.x,
                                                y: l.y
                                        }, 6 * d / i, Phaser.Easing.Linear.None), s.to({
                                                x: l.x > r ? 1 : -1
                                        }, 1, Phaser.Easing.Linear.None), s.to({}, 6 * d / i - 100, Phaser.Easing.Linear.None), r = l.x, o = l.y)
                                }
                                Util.isDefined(a) ? (a.onComplete.addOnce(this.stand, this), Util.isDefined(t) && a.onComplete.addOnce(t), this.walk(), this.mode = 0, Util.isDefined(a) && a.start(), Util.isDefined(s) && s.start()) : (Util.isDefined(t) && t(), this.stand())
                        }
                }, Prodigy.Menu.SystemMenu.prototype.openOther = function() {
                        this.game.prodigy.create.textButton(this.content, 150, 50, {
			text: "Watch Intro",
			size: Prodigy.Control.TextButton.MED
		}, this.openIntro.bind(this)), this.game.prodigy.create.textButton(this.content, 150, 125, {
                                text: "Toggle Member",
                                size: Prodigy.Control.TextButton.MED
                        }, this.toggleMember.bind(this)), this.walkSpeedBar = this.game.prodigy.create.slider(this.content, 37, 215, 525, !1, !1), this.walkSpeedBar.reset(200, 0, Math.floor(10 * (this.game.prodigy.player.walkSpeed - .1)), this.setWalkSpeed.bind(this))
                }, Prodigy.Menu.SystemMenu.prototype.setWalkSpeed = function() {
                        this.game.prodigy.player.walkSpeed = (this.walkSpeedBar.page + 1) / 10, this.game.prodigy.create.font(this.content, 37, 185, "Walk Speed", {
                                width: 525,
                                align: "center"
                        })
                }
        }
        initFastGameSpeedMod() {
                var e = Phaser.TweenManager.prototype.add,
                        t = this.game,
                        i = Phaser.Timer.prototype.add,
                        a = Phaser.Tween.prototype.delay,
                        s = Phaser.Tween.prototype.to,
                        r = (Boot.prototype.update, Phaser.AnimationManager.prototype.play),
                        o = Prodigy.TweenController.prototype.set,
                        n = Phaser.AnimationManager.prototype.add,
                        l = Phaser.Game.prototype.update,
                        d = this.animations,
                        h = this.tweens;
                Phaser.Game.prototype.update = function(e) {
                        for (let e = 0; e < d.animations.length; e++) !Util.isDefined(d.animations[e].animation._parent) && d.animations.splice(e, 1);
                        for (let e = 0, t = h.getAll(); e < t.length; e++) !t[e]._parent.src.alive && t.splice(e, 1);
                        return l.call(this, e)
                }, window.setGameSpeed = function(l) {
                        var g = l;
                        if (g < .1) ModHooks.error("Supplied speed multiplier is too low. Try a larger speed value.");
                        else {
                                if (Phaser.TweenManager.prototype.add = function(t) {
                                                t.timeScale = g, e.call(this, t)
                                        }, Phaser.Timer.prototype.add = function(e, t, a) {
                                                return e /= g, i.call(this, e, t, a)
                                        }, Phaser.Tween.prototype.delay = function(e, t) {
                                                return e /= g, a.call(this, e, t)
                                        }, Phaser.Tween.prototype.to = function(e, t, i, a, r, o, n) {
                                                return Util.isDefined(r) && (r /= g), s.call(this, e, t, i, a, r, o, n)
                                        }, Phaser.AnimationManager.prototype.add = function(e, t, i, a, s) {
                                                let r = 10;
                                                Util.isDefined(i) && (r = i, i *= g);
                                                let o = n.call(this, e, t, i, a, s);
                                                return d.register(o, r), o
                                        }, Phaser.AnimationManager.prototype.play = function(e, t, i, a) {
                                                return Util.isDefined(t) && !isNaN(t) && (t *= g), r.call(this, e, t, i, a)
                                        }, Prodigy.TweenController.prototype.set = function(e, t, i, a) {
                                                let s = i,
                                                        r = a;
                                                Util.isDefined(i) && (i /= g), Util.isDefined(a) && (a /= g);
                                                let n = o.call(this, e, t, i, a);
                                                return h.register(this, this.tweens[this.tweens.length - 1], s, r), n
                                        }, Util.isDefined(t.tweens))
                                        for (var c = t.tweens.getAll(), p = 0; p < c.length; p++) c[p].timeScale = g;
                                if (Util.isDefined(d))
                                        for (var u = d.getAll(), m = 0; m < u.length; m++) u[m].speed = g * (Util.isDefined(d.animations[m].baseSpeed) ? d.animations[m].baseSpeed : 10);
                                if (Util.isDefined(h))
                                        for (var f = h.getAll(), y = 0, v = h.getTweens(); y < f.length; y++) v[y].delay = f[y].baseDelay / g, v[y].duration = v[y].frames.length * f[y].baseDelay * f[y].baseDuration / g
                        }
                }, window.setGameSpeed(3), setTimeout((() => {
                        this.info('Use "setGameSpeed(speed)" to change the game speed at anytime.')
                }), 1e3)
        }
        initRebalancedBattleMod() {
                Prodigy.Creature.ATTACK_BONUS = {
                        "A+": 1.6,
                        A: 1.45,
                        "A-": 1.3,
                        "B+": 1.15,
                        B: 1,
                        "B-": .925,
                        "C+": .85,
                        C: .775,
                        "C-": .7
                }, Prodigy.Attacks.prototype.calculateDamage = function(e, t, i, a, s) {
                        Util.isDefined(a) || (a = 0);
                        var r = 0;
                        Util.isDefined(e) && Util.isDefined(e.damage) && (r = e.damage);
                        var o = e.element,
                                n = i.getElement(),
                                l = 0,
                                d = "B",
                                h = 0;
                        return Util.isDefined(t) ? (l = t.getLevel() - 1 + 1, d = Util.isDefined(t.source) && Util.isDefined(t.source.power) ? t.source.power : d, h = (l + 10) / 11) : h = 1, "Glacial Shield" !== e.name && 0 === i.modifiers.ignoreElement && (this.isStrong(o, n) ? r += 4 : this.isWeak(o, n) && 0 >= (r -= 3) && (r = 2)), r = Math.floor(10 * r * s * h * Prodigy.Creature.ATTACK_BONUS[d]), Math.max(Math.floor(r + (Util.isDefined(a) ? a : 0)), 0)
                }, Prodigy.Creature.HEALTH_CURVE = {
                        "A+": 31,
                        A: 29,
                        "A-": 28,
                        "B+": 26,
                        B: 25,
                        "B-": 24,
                        "C+": 22,
                        C: 21,
                        "C-": 19
                }, Prodigy.Creature.getHeartsFromCurve = function(e, t, i) {
                        return Prodigy.Creature.HEALTH_CURVE[e] * (i - t)
                }, Prodigy.Container.CreatureContainer.prototype.levelEventNewHeart = function(e) {
                        for (var t = 0; 10 > t; t++) {
                                var i = this.game.prodigy.create.sprite(this.x, this.y - 50, "core-2", "user-heart");
                                this.game.broadcaster.broadcast(Prodigy.Events.Screen.ADD_CHILD, this.game, [i, "content"]), i.anchor.setTo(.5, .5), i.alpha = .5, this.game.add.tween(i).to({
                                        x: 470
                                }, 600, Phaser.Easing.Linear.None).delay(300 * t).to({
                                        alpha: 0
                                }, 1, Phaser.Easing.Linear.None).start(), this.game.add.tween(i).to({
                                        y: 55
                                }, 600, Phaser.Easing.Quadratic.Out).delay(300 * t).start()
                        }
                        this.source.changeCurrentHearts(Number.MAX_VALUE), this.callBattlePopup({
                                type: Prodigy.Menu.BattleBase.LEVEL_UP,
                                hearts: e,
                                source: this.source
                        })
                }, Prodigy.Creature.prototype.addStars = function(e, t, i, a) {
                        if (Util.isDefined(this.isOpponent) && this.isOpponent) return !1;
                        e = Math.round(e);
                        var s = !1,
                                r = Util.isDefined(this.getLife) ? this.getLife() : "B";
                        if (Util.isDefined(t)) {
                                var o = this.game.prodigy.player;
                                return o.hasValidatedParentEmail() && o.hasCompletedTutorial() && (e *= GameConstants.get("GameConstants.Battle.VALID_PARENT_EMAIL_STARS_PERCENTAGE")), this.starsToProcess += e, !1
                        }
                        this.starsToProcess = 0;
                        var n = this.getLevel();
                        if (this.game.broadcaster.broadcast(Prodigy.Events.Creature.STARS_ADDED, this, null), n >= 125) return !1;
                        if (Util.isDefined(this.data.stars) ? this.data.stars += e : this.data.stars = e, Util.isDefined(i) || (this.starsEarned += e), this.data.level = Prodigy.Creature.levelFromStars(this.data.stars), n !== this.data.level) {
                                this.levelEvents = [];
                                var l = this.getLevelingCurve(this.data.level);
                                if (Util.isDefined(l))
                                        for (var d = 0; d < l.length; d++) Util.inArray(this.levelEvents, l[d]) || this.levelEvents.push(l[d]);
                                Prodigy.Creature.getHeartsFromCurve(r, null, n) !== Prodigy.Creature.getHeartsFromCurve(r, null, this.data.level) ? this.levelEvents.push({
                                        h: Prodigy.Creature.getHeartsFromCurve(r, null, this.data.level) - Prodigy.Creature.getHeartsFromCurve(r, null, n),
                                        lvl: this.data.level
                                }) : this.game.time.events.add(10000, this.changeCurrentHearts.bind(this, Number.MAX_VALUE), this), this.justLeveled = !0, this.game.broadcaster.broadcast(Prodigy.Events.Creature.LEVEL_UP, this, null), s = !0
                        }
                        return Util.isDefined(a) && this.clearUnprocessedLevelEvents(), this.updated = !0, s
                }, Attack.prototype.damage = function() {
                        this.calculateDamageDone(), Util.isDefined(this.atk.type) && "epic-attack" === this.atk.type && (Util.isDefined(this.epic) ? this.game.prodigy.effects.characterImage(this.game.prodigy.create.sprite(this.epic.x, this.epic.y - 50, "battle", "text-epic-attack")) : this.game.prodigy.effects.characterImage(this.game.prodigy.create.sprite(this.source.x, this.source.y - 50, "battle", "text-epic-attack"))), this.potionActive = !1, this.shieldTime = 0;
                        var e = 0;
                        if (Util.isDefined(this.target.source.modifiers) && Util.isDefined(this.target.source.modifiers.potion)) {
                                var t = Items.getItemData("item", this.target.source.modifiers.potion);
                                if (Util.isDefined(t.subType) && "elemental" === t.subType && Util.isDefined(this.atk.element) && ("all" === t.element || this.atk.element === t.element)) {
                                        this.potionActive = !0, this.shieldTime = 1e3, e = t.potency * this.damageDone / 10, this.damageDone -= Math.round(e);
                                        var i = this.target.sprites.add(this.game.prodigy.create.sprite(0, -75, "icons", "potion-buff-" + t.element));
                                        i.anchor.setTo(.5, .5);
                                        var a = this.game.add.tween(i).to({
                                                        alpha: 0
                                                }, 1300, Phaser.Easing.Quadratic.Out),
                                                s = this.game.add.tween(i.scale).to({
                                                        x: 4,
                                                        y: 4
                                                }, 1300, Phaser.Easing.Quadratic.Out);
                                        a.start(), s.onComplete.add((function() {
                                                i.destroy()
                                        }), i), s.start()
                                }
                        }
                        var r = "",
                                o = Math.random() < this.CRITICAL_HIT_THRESHOLD + this.criticalThresholdBonus && "PVP" !== this.game.state.current || "epic-attack" === this.atk.type;
                        o ? (this.damageDone = Math.round(1.5 * this.damageDone), this.game.prodigy.effects.characterImage(this.game.prodigy.create.sprite(this.target.x, this.source.y + 50, "battle", "text-critical-hit"), 1e3 + this.shieldTime), r = "critical-hit") : r = "normal-hit", this.processStars(), this.lastTargetHp = this.target.source.getCurrentHearts(), this.target.source.changeCurrentHearts(-this.damageDone), this.game.prodigy.effects.characterText("-" + this.damageDone, this.target.x, this.source.y, this.shieldTime, {
                                size: 1,
                                font: "battle",
                                mono: 44
                        }), this.game.prodigy.audio.playSFX(Prodigy.Controller.AudioController.SFX_PACKS.BATTLE, r);
                        var n = null;
                        o || 0 !== this.target.source.modifiers.ignoreElement || (this.game.prodigy.attacks.isStrong(this.atk.element, this.target.source.getElement()) ? n = "Powerful!" : this.game.prodigy.attacks.isWeak(this.atk.element, this.target.source.getElement()) && (n = "Weak...")), Util.isDefined(n) && (this.delayComplete = !0, this.game.prodigy.effects.characterText(n, this.target.x, this.source.y + 50, 1e3 + this.shieldTime))
                }
        }
}

function checkForMods(e, t) {
        window.ModHooks = new ModHandler(e), ModHooks.log("Checking for mods...");
        for (var i = 0, a = 0; a < GameMods.available.length; a += 1)
                if (t.includes(GameMods.available[a].id)) try {
                        var s = GameMods.available[a].patch;
                        ModHooks[s].call(ModHooks), ModHooks.log('Mod "' + GameMods.available[a].id + '" successfully applied!'), i += 1
                } catch (e) {
                        ModHooks.error('Error occured while applying mod "' + GameMods.available[a].id + '" to Prodigy!'), console.error(e)
                }
        i > 0 ? ModHooks.log("Applied (" + i + ") mods to the game") : ModHooks.log("No mods have been applied")
}