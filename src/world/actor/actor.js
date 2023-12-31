/* global Phaser */
/**
 * Represents an active game character.
 * @class Actor
 */
export default class Actor {
  /**
   * Creates an instance of Actor.
   * @param {Object} type - The actorType config object of the actor.
   * @param {number} [x=0] - The x coordinate of the actor's position.
   * @param {number} [y=0] - The y coordinate of the actor's position.
   * @param {boolean} isPC - True if the player controls the actor.
   * @memberof Actor
   */
  constructor(type, x = 0, y = 0, isPC) {
    // Set the generic properties of the Actor based on the actorTypes config.
    this.type = type;

    // Set the x coordinate of the Actor's position.
    this.x = x;

    // Set the y coordinate of the Actor's position.
    this.y = y;

    this.isPC = isPC;

    // Manually add an Phaser event emitter because the Actor is not a Phaser
    // class that would already have one. This will be used to notify listeners
    // about the act event of the Actor.
    // Event: complete Listener: World
    // Event: show Listener: EntityImage
    // Event: hide Listener: EntityImage
    // Event: reveal Listener: EntityImage
    // Event: move Listener: EntityImage
    this.events = new Phaser.Events.EventEmitter();

    // Add an EffectManager to the Actor to handle his Effects.
    // this.effects = new EffectManager(this);

    this.xp = this.type.xp || 0;
    this.xpMax = 50;
    this.level = 0;
    this.health = this.type.health;
    this.healthMax = this.health;
    this.mana = this.type.mana;
    this.manaMax = this.mana;
    this.speed = this.type.speed;
    this.speedBase = this.speed;
    this.speedMod = 0;
    this.strength = this.type.strength;
    this.strengthBase = this.strength;
    this.strengthMod = 0;
    this.agility = this.type.agility;
    this.agilityBase = this.agility;
    this.agilityMod = 0;
    this.wisdom = this.type.wisdom;
    this.wisdomBase = this.wisdom;
    this.wisdomMod = 0;
    this.walksOn = this.type.walksOn;
    this.lifespan = this.type.lifespan;
    this.inventory = this.type.inventory;
    this.equipped = {};
    this.layer = 'actor';
    this.visible = false;
    this.view = [];
    this.orders = [];
    this.timeline = null;
    this.next = false;
  }

  get xy() {
    return `${this.x},${this.y}`;
  }

  set xy(xy) {
    this.x = xy.x;
    this.y = xy.y;
  }

  /**
   * @param {boolean} value
   */
  set isNext(value) {
    this.next = value;
    if (value) this.events.emit('next');
  }

  isAt(xy) {
    return xy === this.xy;
  }

  isPCAndAt(xy) {
    return this.isPC && this.isAt(xy);
  }

  isNPCAndAt(xy) {
    return !this.isPC && this.isAt(xy);
  }

  clearView() {
    this.view = [];
  }

  addToView(x, y) {
    this.view.push(`${x},${y}`);
  }

  needsOrderAgainst(actors) {
    return this.hasNoOrders || actors.hasVisibleNPC();
  }
  
  get hasOrder() {
    return !!this.orders.length;
  }

  seesNPC(actors) {
    return this.view.some(xy => actors.some(actor => {
      actor.isNPC && actor.isAt(xy);
    }));
  }

  show() {
    this.events.emit('show');
    this.visible = true;
  }

  hide() {
    this.events.emit('hide');
    this.visible = false;
  }

  wait() {
    this.events.emit('wait');
    this.waiting = true;
  }

  getSpeed() {
    return this.speed;
  }

  /**
   * The act is getting called by the world or by the controller every time
   * when this actor is ready to act.
   *
   * @memberof Actor
   */
  act() {
    if (!this.orders.length) {
      return;
    }
    const order = this.orders.shift();
    this.x = order.x;
    this.y = order.y;
    this.events.emit('move');

    // if (this.lifespan !== undefined) {
    //   if (this.lifespan-- === 0) {
    //     this.leave();
    //     return;
    //   }
    // }

    // this.updateTargetBasedOnEffects();

    // this.autoEquip();

    // this.updateEffects();

    // // If the actor hasn't reached his target yet because that's further than one step away and additional actions are needed to be performed automatically.
    // if (!this.isAtXY(this.target.x, this.target.y)) {

    //   // Make him move towards his target or attack from afar if possible.
    //   this.order();
    // }
  }



  /**
   * Animate all the actions that have been executed since the last animation. After that, allow the player to order the hero or automatically execute the order given to him in one of the previous turns. Either way after the hero performed the action, unlock the engine and let the next hero take his turn. If the hero is not selected, the action will be displayed in the turn of next hero. When this character will be the next to act with his previous order already completed, only the result of his action will be displayed, and only those enemies will be animated, whose turn came after the next hero's turn. If the hero is selected even if it is executing a previous order, the current action needs to be animated and the result needs to be displayed for the player before switching to the next hero. So the actions should be animated for the player from the perspective of the last hero. For the current one it will be enough to show the current state.
   *
   * @memberof Actor
   */
//   showActions() {
//     if (this.dead || !this.scene) {
//       return;
//     }
//     let timeline = this.scene.tweens.createTimeline();
//     let actionDuration = (1000 / game.speed) / this.actions.length;
//     this.actions.forEach(function (action) {
//       if (action.type === 'move') {
//         timeline.add({
//           targets: this,
//           props: {
//             x: {
//               ease: 'Quad.easeInOut',
//               duration: actionDuration,
//               value: action.x * 24 + 12,
//             },
//             y: {
//               ease: 'Quad.easeInOut',
//               duration: actionDuration,
//               value: action.y * 21 + 11
//             },
//             scaleX: {
//               ease: 'Quad.easeOut',
//               duration: actionDuration / 3,
//               yoyo: true,
//               value: 1.2
//             },
//             scaleY: {
//               ease: 'Quad.easeOut',
//               duration: actionDuration / 3,
//               yoyo: true,
//               value: 1.2
//             },
//           }
//         });
//       } else if (action.type === 'attack') {
//         timeline.add({
//           targets: this,
//           x: action.x * 24 + 12,
//           y: action.y * 21 + 11,
//           scaleX: 1.2,
//           scaleY: 1.2,
//           ease: 'Quad.easeOut',
//           duration: actionDuration / 3,
//           yoyo: true
//         });
//       } else if (action.type === 'teleport') {
//         timeline.add({
//           targets: this,
//           x: action.x * 24 + 12,
//           y: action.y * 21 + 11,
//           ease: 'none',
//           duration: 1
//         });
//       }
//     }.bind(this));
//     timeline.play();
//     this.actions = [];
//   }

//   updateTargetBasedOnEffects() {

//     // If fleeing.
//     let fleeing = this.activeEffects.find(function (effect) {
//       return effect.fleeingFrom;
//     })
//     if (fleeing) {
//       this.target.x = this.tileX;
//       this.target.x += this.target.x < fleeing.fleeingFrom.tileX ? -1 : 1;
//       this.target.y = this.tileY;
//       this.target.y += this.target.y < fleeing.fleeingFrom.tileY ? -1 : 1;
//     }

//     // If confused.
//     if (this.activeEffects.some(function (effect) {
//         return effect.confused;
//       })) {
//       this.target.x = this.tileX + ROT.RNG.getUniformInt(-1, 1);
//       this.target.y = this.tileY + ROT.RNG.getUniformInt(-1, 1);
//     }

//     // If cornered.
//     if (!this.walksOnXY(this.target.x, this.target.y)) {
//       this.target.x = this.tileX;
//       this.target.y = this.tileY;
//     }
//   }

  

//   autoEquip() {
//     Phaser.Utils.Array.Shuffle(this.inventory);
//     if (this.inventory) {
//       this.inventory.forEach(function (item, i) {
//         if (item) { 
//           if (!this.equipped.rightHand
//             && (item.equips === 'hands' 
//             || item.equips === 'hand')) {
//               this.equipped.rightHand = item;
//               this.inventory[i] = null;
//           } else if (item.equips 
//             && !this.equipped[item.equips] 
//             && item.equips !== 'hands'
//             && item.equips !== 'hand') {
//               this.equipped[item.equips] = item;
//               this.inventory[i] = null;
//           }
//         }
//       }, this);
//     }
//     this.updateAttributes();
//   }

//   /**
//    * Update the effects currently affecting the actor by reducing the number of remaining turns they will be active. If there are no more turns left, remove the effect.
//    *
//    * @memberof Actor
//    */
//   updateEffects() {
//     for (let i = 0; i < this.activeEffects.length; i += 1) {
//       if (this.activeEffects[i].timeLeft-- === 0) {
//         this.activeEffects.splice(i, 1);
//       }
//     }
//     this.updateAttributes();
//   }

//   setItem(item, slot, i) {
//     slot[i] = item ? Object.assign({}, item) : undefined;
//     this.updateAttributes();
//     if (slot === this.ground) {
//       if (slot.some(function (value) {
//         return value;
//       })) {        
//         this.scene.map.putItem(this.tileX, this.tileY, slot);
//       } else {
//         this.scene.map.removeItem(this.tileX, this.tileY);
//       }
//     }
//   }

//   updateAttributes() {        
//     this.updateDefense();
//     this.updateStrength();
//     this.updateLoad();
//     this.updateSpeed();
//     this.updateAgility();
//     this.updateWisdom();
//     this.updateDamage();
//     this.updateRangedDamage();

//     // Emit the GUI update just in case the target is the player.
//     this.scene.events.emit('attributesUpdated', this);
//   }

//   updateLoad() {
//     this.load = 0;
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         this.load += this.equipped[item].weight || 0;
//       }
//     }.bind(this));
//     this.inventory.forEach(function (item) {
//       if (item) {
//         this.load += item.weight || 0;
//       }
//     }.bind(this));
//   }

//   /**
//    * Update the damage and maximum damage attributes of the actor to have the values handy when he wants to hit someone and to keep the player informed about them if needed.
//    *
//    * @memberof Actor
//    */
//   updateDamage() {

//     // Every time the attributes get updated, the damage will be calculated from scratch to prevent asynchronicity. The maximum damage - as the bit-shifted strength of the actor increased by 1 - is granted. Even if the actor is dual-wielding, the strength-based damage won't be doubled.
//     this.damageMax = (this.strength >> 2) + 1;

//     // If the actor wields a weapon in his left hand.
//     if (this.equipped.leftHand) {

//       // Add the weapon damage to the maximum damage.
//       this.damageMax += this.equipped.leftHand.damage || 0;
//     }

//     // If the actor wields a weapon in his right hand.
//     if (this.equipped.rightHand) {

//       // Add the weapon damage to the maximum damage.
//       this.damageMax += this.equipped.rightHand.damage || 0;
//     }

//     this.activeEffects.forEach(function (effect) {
//       if (effect.damageMod) {
//         this.damageMax += effect.damageMod;
//       }
//     }, this);

//     // Set the minimum damage as half of the maximum damage.
//     this.damage = ~~(this.damageMax / 2);
//   }

//   /**
//    * Update the ranged damage and maximum ranged damage attributes of the actor to have the values handy when he wants to hit someone and to keep the player informed about them if needed.
//    *
//    * @memberof Actor
//    */
//   updateRangedDamage() {

//     // Every time the attributes get updated, the ranged damage will be calculated from scratch to prevent asynchronicity. The maximum damage - as the bit-shifted agility of the actor - is granted. In the original game this was only true for throwing weapons, but here it is simplified to help the player more easily decide between melee and ranged attack. Even if the actor is dual-wielding, the agility-based damage won't be doubled.
//     this.rangedDamageMax = this.agility >> 1;

//     // If the actor wields a ranged weapon in his left hand.
//     if (this.equipped.leftHand) {

//       // Add the weapon ranged damage to the maximum ranged damage.
//       this.rangedDamageMax += this.equipped.leftHand.damageRanged || 0;
//     }

//     // If the actor wields a ranged weapon in his right hand.
//     if (this.equipped.rightHand) {

//       // Add the weapon ranged damage to the maximum ranged damage.
//       this.rangedDamageMax += this.equipped.rightHand.damageRanged || 0;
//     }

//     this.activeEffects.forEach(function (effect) {
//       if (effect.damageMod) {
//         this.rangedDamageMax += effect.damageMod;
//       }
//     }, this);

//     // Set the minimum damage as half of the maximum damage.
//     this.rangedDamage = ~~(this.rangedDamageMax / 2);
//   }

//   updateDefense() {
//     this.defense = 0;
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         this.defense += this.equipped[item].defense || 0;
//       }
//     }.bind(this));
//   }

//   updateSpeed() {
//     this.speedMod = 0;
//     if (this.load > this.strength * 2) {
//       this.speedMod = -this.speedBase;
//     } else if (this.load > this.strength * 1.5) {
//       this.speedMod = -~~((this.speedBase / 3) * 2);
//     } else if (this.load > this.strength) {
//       this.speedMod = -~~(this.speedBase / 3);
//     }
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         if (this.equipped[item].speed) {
//           this.speedMod += this.equipped[item].speed;
//         }
//       }
//     }.bind(this));
//     this.activeEffects.forEach(function (effect) {
//       if (effect.speedMod) {
//         this.speedMod += effect.speedMod;
//       }
//     }, this);
//     this.speedMod = this.getLimitedMod(this.speedBase, this.speedMod, 1, 15);
//     this.speed = this.speedBase + this.speedMod;
//   }

//   updateStrength() {
//     this.strengthMod = 0;
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         if (this.equipped[item].strength) {
//           this.strengthMod += this.equipped[item].strength;
//         }
//       }
//     }.bind(this));
//     this.strengthMod = this.getLimitedMod(this.strengthBase, this.strengthMod, 1, 100);
//     this.strength = this.strengthBase + this.strengthMod;
//   }

//   updateWisdom() {
//     this.wisdomMod = 0;
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         if (this.equipped[item].wisdom) {
//           this.wisdomMod += this.equipped[item].wisdom;
//         }
//       }
//     }.bind(this));
//     this.wisdomMod = this.getLimitedMod(this.wisdomBase, this.wisdomMod, 0, 25);
//     this.wisdom = this.wisdomBase + this.wisdomMod;
//   }

//   /**
//    * Update the agility and agility modifier attributes of the actor to have the values handy when he wants to hit someone and to keep the player informed about them if needed.
//    *
//    * @memberof Actor
//    */
//   updateAgility() {

//     // Every time the agility gets updated, the modifier will be calculated from scratch to prevent asynchronicity.
//     this.agilityMod = 0;

//     // Iterate through all the equipment of the actor and search for agility modifier enchantments on them.
//     Object.keys(this.equipped).forEach(function (item) {

//       // If the actor's given equipment slot is not empty.
//       if (this.equipped[item]) {

//         // And if the given equipment slot contains an item that modifies the agility.
//         if (this.equipped[item].agility) {

//           // Add this modifier value to the agility modifier.
//           this.agilityMod += this.equipped[item].agility;
//         }
//       }
//     }, this);

//     // If the actor is dual-wielding.
//     if (
//       this.equipped.leftHand && 
//       (this.equipped.leftHand.damage || this.equipped.leftHand.damageRanged) &&
//       this.equipped.rightHand && 
//       (this.equipped.rightHand.damage || this.equipped.rightHand.damageRanged)
//     ) {

//       // Reduce his agility.
//       this.agilityMod -= 5;
//     }

//     // The modified agility has to be limited to a number between 0 and 19 to keep the chance to hit between 0% and 95%. If the agility modifier would increase or decrease the base agility so much that it would end up out of this range, the modifier will be limited as well to keep the displayed values consistent.
//     this.agilityMod = this.getLimitedMod(this.agilityBase, this.agilityMod, 1, 25);

//     // Update the agility based on the current sum of the above-modified and limited values.
//     this.agility = this.agilityBase + this.agilityMod;

//     // Update the chance to hit based on the current agility.
//     this.chanceToHit = (this.agility * 5) + '%';
//   }

//   getLimitedMod(base, mod, min, max) {

//     // If the modified value became more than the maximum value.
//     if (base + mod > max) {
      
//       // Set the modifier as the difference between the base value and the max value.
//       mod = max - base;
      
//       // Else if the modified value became less than the minimum value.
//     } else if (base + mod < min) {

//       // Set the modifier as the difference between the base value and the min value. 
//       mod = min - base;
//     }
//     return mod;
//   }

//   order() {
//     this.path = [];
//     let actor = this.scene.getActorAt(this.target.x, this.target.y);
//     let spell = this.equipped.leftHand || this.equipped.rightHand;
//     if (spell && spell.manaCost && this.mana >= spell.manaCost) {
//       if (actor && !spell.summons) {
//         this.castSpellOn(spell, actor);
//       } else if (spell.summons) {
//         let x = this.getClosestXTowardsTarget();
//         let y = this.getClosestYTowardsTarget();
//         actor = this.scene.getActorAt(x, y);
//         if (!actor) {
//           this.summonAt(x, y, spell);
//         } else {
//           this.move();
//         }
//       } else {
//         this.move();
//       }
//     } else if (this.isWieldingRangedWeapon()) {
//       if (actor 
//         && this.isEnemyFor(actor)
//         && (Math.abs(this.target.x - this.tileX) > 1
//         || Math.abs(this.target.y - this.tileY) > 1)) {
//         this.rangedAttack(actor);
//         this.target = {
//           x: this.tileX,
//           y: this.tileY
//         }
//       } else {
//         this.move();
//       }
//     } else {
//       this.move();
//     }
//   }

//   regenerate() {
//     Object.keys(this.equipped).forEach(function (item) {
//       if (this.equipped[item]) {
//         if (this.equipped[item].healthRegen) {

//           // If the actor's health did not reach the maximum yet.
//           if (this.health < this.healthMax) {

//             // Make the actor get back one health point. 
//             this.health = Math.min(this.health + 3, this.healthMax);
//             this.scene.events.emit('attributesUpdated', this);
//           }
//         }
//         if (this.equipped[item].manaRegen) {

//           // If the actor's health did not reach the maximum yet.
//           if (this.mana < this.manaMax) {

//             // Make the actor get back one health point. 
//             this.mana = Math.min(this.mana + 3, this.manaMax);
//             this.scene.events.emit('attributesUpdated', this);
//           }
//         }
//       }
//     }.bind(this));
//   }

//   // This function is required for the Speed scheduler to determine the sequence of actor actions.
//   getSpeed() {

//     // Return the speed of the actor.
//     return this.speed;
//   }

//   // Return true if the target tile is walkable by the actor. This is called by the calculate shortest path function and by the GUI when determining where the pointer marker can be displayed.
//   walksOnXY(x, y) {    
//     if (
//       this.isAtXY(x, y) || 
//       this.scene.enemies.some((enemy) => enemy.isAtXY(x, y))
//     ) {
//       return true;
//     }

//     // Get the tile name at the given position. The name of the tile is unique hence enough to determine its attributes including its walkabilty.
//     let tile = this.scene.map.getTileNameAt(x, y);
//     if (this.activeEffects.some(function (effect) {
//         return effect.walksOn === 'nothing';
//       })) {
//       return false;
//     }
//     if (this.activeEffects.some(function (effect) {
//         return effect.walksOn === 'everything';
//       })) {
//       return true;
//     }

//     // Return true if the actor is able to walk on that type of tiles or if it is generally walkable by every actor.
//     return this.walksOn.includes(tile) || (
//       tile !== 'waterTile' &&
//       tile !== 'marsh' &&
//       tile !== 'bush' &&
//       tile !== 'tree' &&
//       tile !== 'palmTree' &&
//       tile !== 'stoneWall' &&
//       tile !== 'mountain'
//     );
//   }

//   isWieldingRangedWeapon() {
//     let leftHand = this.equipped.leftHand;
//     let rightHand = this.equipped.rightHand;
//     let returningArrows = false;
//     this.usedArrowI = -1;
//     if (leftHand && leftHand.ranged ||
//       rightHand && rightHand.ranged ||
//       leftHand && leftHand.throwable ||
//       rightHand && rightHand.throwable
//     ) {
//       return true;
//     }
//     if (leftHand && leftHand.usesArrow || rightHand && rightHand.usesArrow) {
//       returningArrows = this.inventory.some(function (item) {
//         if (!item) {
//           return false;
//         }
//         return item.arrow && item.returns;
//       });
//       if (returningArrows) {
//         return true;
//       }
//       this.usedArrowI = this.inventory.findIndex(function (item) {
//         if (!item) {
//           return false;
//         }
//         return item.arrow && item.amount;
//       });
//       if (this.usedArrowI !== -1) {
//         return true;
//       }     
//     }    
//     return false;
//   }

//   isEnemyFor(actor) {
//     return this.scene.enemies.includes(this) 
//     === !this.scene.enemies.includes(actor)
//   }

//   // Calculate the shortest path between the actor's current position and the given target position.
//   addPath(x, y) {

//     // Initialize a new astar pathmap based on the given target.
//     let a = new ROT.Path.AStar(x, y, this.walksOnXY.bind(this));

//     // After generated the pathmap create a new path for the actor.
//     this.path = [];

//     // Compute the shortest path between the actor's current position and the given target position based on the astar map.
//     a.compute(this.tileX, this.tileY, function (x, y) {

//       // Add the next position of the shortest path to the actor's path.
//       this.path.push({
//         x: x,
//         y: y
//       });
//     }.bind(this));
//   }

//   // Check if the actor is at the given position.
//   isAt(x, y) {

//     // Return true if the actor's tileX and tileY attributes are matching with the given x and y values.
//     return this.tileX === x && this.tileY === y;
//   }

//   castSpellOn(spell, actor) {
//     this.mana -= spell.manaCost;
//     if (actor.inventory.some(function (item) {
//       if (item) {
//         return item.name === 'negator';
//       }
//       return false;
//     })) {
//       this.createEffect(actor, 'negate');
//       return;
//     }
//     let hit = ROT.RNG.getUniformInt(1, 20);
//     if (hit > this.wisdom) {

//       // Add the miss effect.
//       this.createEffect(actor, 'huh');

//       // Skip the rest.
//       return;
//     }
//     if (spell.damageMod) {
//       this.createEffect(actor, spell.effect);
//       this.activeEffects.push({
//         damageMod: spell.damageMod,
//         timeLeft: actor.speedBase
//       });
//     }
//     if (spell.speedMod) {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         speedMod: spell.speedMod,
//         timeLeft: actor.speedBase
//       });
//     }
//     if (spell.speedFix) {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         speedMod: spell.speedFix - actor.speed,
//         timeLeft: 1
//       });
//     }
//     if (spell.walksOn) {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         walksOn: spell.walksOn,
//         timeLeft: actor.speedBase
//       });
//     }
//     if (spell.name === 'protection') {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         protected: true,
//         timeLeft: actor.speedBase
//       });
//       return;
//     }
//     if (spell.name === 'purify') {
//       if (actor.lifespan) {
//         this.createEffect(actor, spell.effect);
//         actor.leave();
//       };
//       return;
//     }
//     if (spell.name === 'confusion') {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         confused: true,
//         timeLeft: actor.speedBase
//       });
//       return;
//     }
//     if (spell.name === 'portal') {
//       this.createEffect(actor, spell.effect);
//       actor.activeEffects.push({
//         toBeTeleported: true,
//         timeLeft: 1
//       });
//       return;
//     }
//     if (spell.name === 'hyperspace') {
//       this.createEffect(actor, spell.effect);
//       actor.tileX += ROT.RNG.getUniformInt(-1000, 1000);
//       actor.tileY += ROT.RNG.getUniformInt(-1000, 1000);
//       this.actions.push({
//         type: 'teleport',
//         x: this.tileX,
//         y: this.tileY
//       });
//       actor.target = {
//         x: actor.tileX,
//         y: actor.tileY
//       };
//       return;
//     }
//     if (spell.name === 'terror') {
//       if (actor !== this) {
//         this.createEffect(actor, spell.effect);
//         actor.activeEffects.push({
//           fleeingFrom: this,
//           timeLeft: actor.speedBase
//         });
//       }     
//       return;
//     }
//     if (spell.name === 'panic') {
//       for (let x = -6; x < 7; x += 1) {
//         for (let y = -6; y < 7; y += 1) {
//           let victim = this.scene.getActorAt(actor.tileX + x, actor.tileY + y);
//           if (victim && victim !== this) {
//             this.createEffect(victim, spell.effect);
//             victim.activeEffects.push({
//               fleeingFrom: this,
//               timeLeft: victim.speedBase
//             })
//           }
//         }
//       }      
//       return;
//     }
//     if (spell.name === 'vision') {
//       actor.activeEffects.push({
//         seeing: this,
//         timeLeft: 0
//       });
//       return;
//     }
//     if (spell.name === 'thunder storm') {      
//       for (let i = 0; i < 20 ; i += 1) {
//         let x = actor.tileX + ROT.RNG.getUniformInt(-1, 1);
//         let y = actor.tileY + ROT.RNG.getUniformInt(-1, 1);
//         let victim = this.scene.getActorAt(x, y);
//         if (victim) {
//           victim.health += spell.health; 
          
//           // If the target actor's health reached zero.
//           if (victim.health < 1) {

//             if (victim === this.scene.player) {
//               game.killer = this.name;
//             }

//             // Kill the actor.
//             victim.die();
//           }
//         }
//         this.createEffectAt(x, y, spell.effect);
//       }
//       return;
//     }
//     if (spell.name === 'inferno') {      
//       let a = new ROT.Path.AStar(actor.tileX, actor.tileY, function () {
//         return true;
//       });
//       let fires = [];
//       a.compute(this.tileX, this.tileY, function (x, y) {

//         // Add the next position of the shortest path to the fire's path.
//         fires.push({
//           x: x,
//           y: y
//         });
//       }.bind(this));
//       fires.shift();        
//       for (let x = -1; x < 2 ; x += 1) {
//         for (let y = -1; y < 2; y += 1 ) {
//           if (!(x === 0 && y === 0)) {
//             fires.push({
//               x: actor.tileX + x,
//               y: actor.tileY + y
//             });
//           }
//         }
//       }
//       fires.forEach(function (fire) {
//         let victim = this.scene.getActorAt(fire.x, fire.y);
//         if (victim) {
//           victim.health += spell.health; 
          
//           // If the target actor's health reached zero.
//           if (victim.health < 1) {

//             if (victim === this.scene.player) {
//               game.killer = this.name;
//             }

//             // Kill the actor.
//             victim.die();
//           }
//         }
//         this.createEffectAt(fire.x, fire.y, spell.effect);
//       }, this);
//       return;
//     }
//     if (spell.health) {
//       this.createEffect(actor, spell.effect);
//       actor.health = Math.min(actor.health + spell.health, actor.healthMax);

//       // If the target actor's health reached zero.
//       if (actor.health < 1) {

//         // Kill the actor.
//         if (actor === this.scene.player) {
//           game.killer = this.name;
//         }

//         actor.die();
//       }
//     }
//     if (spell.name === 'chaos') {
//       this.createEffect(actor, spell.effect);

//       // Drop inventory.
//       actor.inventory = actor.inventory.filter(item => item !== null);
//       if (actor.inventory.length > 0) {
//         actor.scene.map.addItem(actor.tileX, actor.tileY, actor.inventory);
//       }
//       actor.inventory = [];
//     }
//     this.updateAttributes();
//     return;
//   }

//   getClosestXTowardsTarget() {
//     let x = this.tileX;
//     x += this.target.x > this.tileX ? 1 : 0;
//     x += this.target.x < this.tileX ? -1 : 0;
//     return x;
//   }

//   getClosestYTowardsTarget() {
//     let y = this.tileY;
//     y += this.target.y > this.tileY ? 1 : 0;
//     y += this.target.y < this.tileY ? -1 : 0;
//     return y;
//   }

//   summonAt(x, y, spell) {
//     this.mana -= spell.manaCost;
//     let hit = ROT.RNG.getUniformInt(1, 20);
//     if (hit > this.wisdom) {
//       return;
//     }
//     let tile = this.scene.map.getTileNameAt(x, y);
//     if (this.scene.actorTypes[spell.summons].walksOn || (
//       tile !== 'waterTile' &&
//       tile !== 'marsh' &&
//       tile !== 'bush' &&
//       tile !== 'tree' &&
//       tile !== 'palmTree' &&
//       tile !== 'stoneWall' &&
//       tile !== 'mountain'
//     )) {
//       let enemy = new Actor(this.scene, x, y, 'tiles', spell.summons);
//       this.scene.enemies.push(enemy);
//       this.createEffect(enemy, spell.effect);
//     }
//   }

//   // Order the actor to move towards the specified position or make him rest if it is the actor's current position. This action can be called during every action of the actor before he reaches his destination.
//   move() {

//     // If the actor has been ordered to move to his current position that means the actor would like to have some rest or use the currently held item on himself. This action can't be reached as part of a continues movement towards a target further away, since that option has been already handled as part of the act function, and this function can be reached from there only if the actor is not standing at the target position.
//     if (this.isAtXY(this.target.x, this.target.y)) {

//       if (this.equipped.leftHand && this.equipped.leftHand.consumable) {        
//         this.healthMax += this.equipped.leftHand.healthMax || 0;
//         this.health += this.equipped.leftHand.healthMax || 0;
//         this.manaMax += this.equipped.leftHand.manaMax || 0;
//         this.mana += this.equipped.leftHand.manaMax || 0;
//         this.speedBase += this.equipped.leftHand.speedBase || 0;
//         this.strengthBase += this.equipped.leftHand.strengthBase || 0;
//         this.agilityBase = Math.max(
//           0, 
//           this.agilityBase + (this.equipped.leftHand.agilityBase || 0)
//         );
       
//         this.wisdomBase = Math.max(
//           0,
//           this.wisdomBase + (this.equipped.leftHand.wisdomBase || 0)
//         );        
//         this.earnXP(this.equipped.leftHand.xp || 0);
//         this.equipped.leftHand = undefined;
//         this.createEffect(this, "uh");
//       }
//       if (this.equipped.rightHand && this.equipped.rightHand.consumable) {
//         this.healthMax += this.equipped.rightHand.healthMax || 0;
//         this.health += this.equipped.rightHand.healthMax || 0;
//         this.manaMax += this.equipped.rightHand.manaMax || 0;
//         this.mana += this.equipped.rightHand.manaMax || 0;
//         this.speedBase += this.equipped.rightHand.speedBase || 0;
//         this.strengthBase += this.equipped.rightHand.strengthBase || 0;
//         this.agilityBase = Math.max(
//           0,
//           this.agilityBase + (this.equipped.rightHand.agilityBase || 0)
//         );
//         this.wisdomBase = Math.max(
//           0,
//           this.wisdomBase + (this.equipped.rightHand.wisdomBase || 0)
//         );
//         this.earnXP(this.equipped.rightHand.xp || 0);
//         this.equipped.rightHand = undefined;
//         this.createEffect(this, "uh");
//       }
//       this.updateAttributes();

//       // Make the actor rest until his next action and get back a health point.
//       this.rest();
//       this.regenerate();

//       // Since the actor only wanted to rest there is no need for further actions.
//       return;
//     }

//     let toBeTeleported = this.activeEffects.some(function (effect) {
//       return effect.toBeTeleported;
//     });
//     let victim;
//     if (toBeTeleported) {
//       victim = this.scene.getActorAt(this.target.x, this.target.y);
//       if (!victim) {
//         this.tileX = this.target.x;
//         this.tileY = this.target.y;
//         this.createEffect(this, "bam");
//         this.actions.push({
//           type: 'teleport',
//           x: this.tileX,
//           y: this.tileY
//         });
//         return;
//       }
//     }

//     // If the actor has been ordered to a different position and just started to move towards that position there can't be an already calculated path for him. Or if the actor just arrived to its destination during his last action, the last step will be still there as the last remaining element of the path, and that will be the actor's current position. That path can be ignored and no further automatic action should be performed. So in both cases this part of the code has been reached because the actor has been given a new order.
//     //if (!this.path || this.path.length < 2) {

//       // Calculate a new path for the actor towards his new target.
//       this.addPath(this.target.x, this.target.y);
//     //}

//     // Remove the first element of the path because that's the actor's current position.
//     this.path.shift();

//     // If the target is unreachable
//     if (!this.path[0]) {
//       return;
//     }

//     if (toBeTeleported && victim && this.path.length > 3) {
//       this.tileX = this.path[this.path.length - 3].x;
//       this.tileY = this.path[this.path.length - 3].y;
//       this.createEffect(this, "bam");
//       this.actions.push({
//         type: 'teleport',
//         x: this.tileX,
//         y: this.tileY
//       });
//       return;
//     }

//     // Get any actor at the previously second, now first element of the path, that will be the next step of this actor.
//     let actor = this.scene.getActorAt(this.path[0].x, this.path[0].y);

//     // If there is an actor at the next step. 
//     if (actor) {

//       // If that actor is in a different team, the moving actor will damage his victim.
//       if (this.isEnemyFor(actor)) {

//         // Damage that actor.
//         this.causeDamage(
//           actor, 
//           ROT.RNG.getUniformInt(this.damage, this.damageMax),
//           ~~(this.damageMax * 1.5)
//         );

//         // Set the enemy as the current victim of the actor so the attack animation can be targetted correctly.
//         this.victimX = this.path[0].x;
//         this.victimY = this.path[0].y;

//         this.actions.push({
//           type: 'attack',
//           x: this.victimX,
//           y: this.victimY
//         });

//         this.regenerate();
      
//       // If that actor is in the same team, this will be only a friendly bump, that still counts as a valid action so this actor can be skipped.
//       } else {

//         // Stop the blocked actor.
//         this.target = {
//           x: this.tileX,
//           y: this.tileY
//         };

//         // Reset his path and let him recalculate it as his next action.
//         this.path = [];
//       }

//     // If there isn't any actor in the way of the actor.
//     } else {

//       // Move the actor.
//       this.tileX = this.path[0].x;
//       this.tileY = this.path[0].y;

//       this.actions.push({
//         type: 'move',
//         x: this.tileX,
//         y: this.tileY
//       });

//       this.regenerate();
//     }
//   }

//   // Make the actor rest until the his next action and get back a health point.
//   rest() {

//     // Check all the enemies.
//     if (this.scene.enemies.some(function (enemy) {

//       // If there is at least one enemy that is still heading towards the last seen position of the player.
//       return !enemy.isAtXY(enemy.target.x, enemy.target.y);
//     })) {

//       // Make the actor get back one health point. 
//       this.health = Math.min(this.health + 1, this.healthMax);

//       // Make the actor get back one mana point. 
//       this.mana = Math.min(this.mana + 1, this.manaMax);
    
//     // If every enemy is either idle or dead. 
//     } else {

//       // The player has plenty of time to rest.
//       this.health = this.healthMax;
//       this.mana = this.manaMax;
//     }
//   }

//   createEffect(actor, effectType) {
//     let effect = this.scene.add.sprite(actor.x, actor.y, 'tiles', effectType);
//     effect.actor = actor;
//     effect.depth = 4;
//     effect.visible = false;
//     this.scene.effects.push(effect);
//   }

//   createEffectAt(x, y, effectType) {
//     let effect = this.scene.add.sprite(x * 24 + 11, y * 21 + 11, 'tiles', effectType);
//     effect.depth = 4;
//     effect.visible = false;
//     this.scene.effects.push(effect);
//   }
  
//   /**
//    * Decides if the attack was successful then reduces the health of the victim with the given value and the victim's defense.
//    *
//    * @param {Actor} actor The target of the current actor the will suffer the damage.
//    * @param {Number} damage The pre-calculated, randomly selected melee or ranged damage.
//    * @param {Number} critDamage The pre-calculated critical damage that will be used in case of a critical hit.
//    * @param {String} [effectType] The name of the special effect that should be displayed in case of special weapons.
//    * @returns null if the attempt was unsuccessful.
//    * @memberof Actor
//    */
//   causeDamage(actor, damage, critDamage, effectType) {    

//     if (this === this.scene.player) {
//       this.target = {
//         x: this.tileX,
//         y: this.tileY
//       }
//     }

//     // Roll for hit.
//     let hit = ROT.RNG.getUniformInt(1, 20);

//     // If the roll is unsuccessful.
//     if (hit > this.agility) {

//       // Add the miss effect.
//       this.createEffect(actor, 'huh');

//       // Skip the rest.
//       return;
//     }
    
//     // If the player rolled in the top 15%.
//     if (hit < 4) {
      
//       // Consider it as a critical hit and set the damage.
//       damage = critDamage;

//       // If the used weapon does not have a special effect, use the critical hit effect.
//       effectType = effectType || 'zok';
//     }

//     // If protected.
//     if (actor.activeEffects.some(function (effect) {
//       return effect.protected;
//     })) {
//       damage >>= 1;
//     }

//     // Decrease the damage with the victim's defense.
//     damage -= actor.defense || 0;

//     // If the damage got reduced to at most 0.
//     if (damage < 1) {

//        // Add the miss effect.
//        this.createEffect(actor, 'huh');

//        // Skip the rest.
//        return;
//     }

//     // Else decrease the health of the target actor with the remaining damage.
//     actor.health -= damage;

//     // If the used weapon does not have a special effect, add the normal hit effect.
//     this.createEffect(actor, effectType || 'bif');

//     // If the target actor's health reached zero.
//     if (actor.health < 1) {

//       if (actor === this.scene.player) {
//         game.killer = this.name;
//       }

//       // Kill the actor.
//       actor.die();
//     }

//     // Emit the GUI update just in case the target is the player.
//     this.scene.events.emit('attributesUpdated', this);
//   }

//   rangedAttack(actor) {

//     let leftHand = this.equipped.leftHand;
//     let rightHand = this.equipped.rightHand;
//     let effect;

//     if (this.usedArrowI !== -1) {
//       this.inventory[this.usedArrowI].amount -= 1;
//       if (this.inventory[this.usedArrowI].amount === 0) {
//         this.inventory[this.usedArrowI] = undefined;
//       }
//     }

//     // Damage that actor.
//     if (leftHand && leftHand.effect) {
//       effect = leftHand.effect;
//       actor.health += leftHand.health;
//     }
//     if (rightHand && rightHand.effect) {
//       effect = rightHand.effect;
//       actor.health += rightHand.health;
//     }
//     this.causeDamage(
//       actor, 
//       ROT.RNG.getUniformInt(this.rangedDamage, this.rangedDamageMax),
//       ~~(this.rangedDamageMax * 1.5),
//       effect
//     );
//     if (leftHand && leftHand.throwable) {
//       this.equipped.leftHand = undefined;  
//       this.scene.map.addItem(actor.tileX, actor.tileY, [leftHand]);
//     }
//     if (rightHand && rightHand.throwable) {
//       this.equipped.rightHand = undefined;
//       this.scene.map.addItem(actor.tileX, actor.tileY, [rightHand]);
//     }

//     this.regenerate();

//     // Emit the GUI ground update just in case the target is the player.
//     this.scene.events.emit('playerMoved', this);
//     this.updateAttributes();
//   }

//   // Banish the summoned.
//   leave() {

//     // Remove the enemy from the list of enemies.
//     this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);

//     // Remove the enemy from the sceduler.
//     this.scene.scheduler.remove(this);

//     // Destroy the enemy.
//     this.destroy();

//     this.dead = true;
//   }

//   // Kill this actor.
//   die() {

//     if (this.lifespan !== undefined) {
//       this.leave();
//       return;
//     }

//     // Give some XP to the player.
//     this.scene.player.earnXP(this.xp);
//     this.scene.events.emit('attributesUpdated', this);

//     if (this.equipped) {
//       for (let i in this.equipped) {
//         this.inventory.push(this.equipped[i]);
//       }      
//     }
//     this.inventory = this.inventory.filter(item => item !== null);
//     if (this.inventory.length > 0) {
//       this.scene.map.addItem(this.tileX, this.tileY, this.inventory);
//     }

//     // Show the remains of the enemy.
//     let remains = 
//       this.scene.add.sprite(this.x, this.y, 'tiles', this.tileName);
    
//     remains.setDepth(4);

//     // Wait until the damage effect is emitted
//     this.scene.time.delayedCall(500 / game.speed, function () {

//       // Destroy the remains.
//       remains.destroy();
//     });

//     // Remove the enemy from the list of enemies.
//     this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);

//     // Remove the enemy from the sceduler.
//     this.scene.scheduler.remove(this);

//     // Destroy the enemy.
//     this.destroy();

//     this.dead = true;
//   }
}