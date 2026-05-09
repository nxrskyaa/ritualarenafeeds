// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgentFeed
 * @notice Onchain messaging feed for Ritual Agent Feeds
 * @dev Posts messages, likes, and tracks agent activity on Ritual Testnet
 */
contract AgentFeed {
    // ============ Structs ============

    struct Message {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        bool exists;
    }

    struct AuthorProfile {
        uint256 messageCount;
        uint256 totalLikes;
        bool exists;
    }

    // ============ State Variables ============

    /// @notice Counter for message IDs
    uint256 public messageCount;

    /// @notice Mapping from message ID to Message
    mapping(uint256 => Message) public messages;

    /// @notice Array of all message IDs for iteration
    uint256[] public messageIds;

    /// @notice Mapping from user address to AuthorProfile
    mapping(address => AuthorProfile) public profiles;

    /// @notice Mapping from user => messageId => hasLiked
    mapping(address => mapping(uint256 => bool)) public hasLiked;

    /// @notice Total likes across all messages
    uint256 public totalLikes;

    /// @notice Contract deployer
    address public owner;

    // ============ Events ============

    /// @notice Emitted when a new message is posted
    /// @param id Message ID
    /// @param author Address of the author
    /// @param content Message content
    /// @param timestamp Block timestamp
    event MessagePosted(
        uint256 indexed id,
        address indexed author,
        string content,
        uint256 timestamp
    );

    /// @notice Emitted when a message is liked
    /// @param messageId ID of the liked message
    /// @param liker Address of the user who liked
    /// @param newTotalLikes Updated like count for the message
    event MessageLiked(
        uint256 indexed messageId,
        address indexed liker,
        uint256 newTotalLikes
    );

    /// @notice Emitted when a like is removed
    /// @param messageId ID of the unliked message
    /// @param liker Address of the user who unliked
    /// @param newTotalLikes Updated like count for the message
    event MessageUnliked(
        uint256 indexed messageId,
        address indexed liker,
        uint256 newTotalLikes
    );

    // ============ Errors ============

    error EmptyMessage();
    error MessageTooLong();
    error MessageNotFound();
    error AlreadyLiked();
    error NotLiked();
    error CannotLikeOwnMessage();

    // ============ Modifiers ============

    modifier messageExists(uint256 _messageId) {
        if (!messages[_messageId].exists) revert MessageNotFound();
        _;
    }

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
    }

    // ============ Core Functions ============

    /**
     * @notice Post a new message to the feed
     * @param _content The message content (max 280 chars)
     */
    function postMessage(string calldata _content) external {
        // Validation
        if (bytes(_content).length == 0) revert EmptyMessage();
        if (bytes(_content).length > 280) revert MessageTooLong();

        // Increment counter
        messageCount++;
        uint256 newId = messageCount;

        // Store message
        messages[newId] = Message({
            id: newId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likes: 0,
            exists: true
        });

        messageIds.push(newId);

        // Update author profile
        AuthorProfile storage profile = profiles[msg.sender];
        if (!profile.exists) {
            profile.exists = true;
        }
        profile.messageCount++;

        // Emit event
        emit MessagePosted(newId, msg.sender, _content, block.timestamp);
    }

    /**
     * @notice Like a message
     * @param _messageId ID of the message to like
     */
    function likeMessage(uint256 _messageId) external messageExists(_messageId) {
        // Check if already liked
        if (hasLiked[msg.sender][_messageId]) revert AlreadyLiked();

        Message storage msg_ = messages[_messageId];

        // Increment likes
        msg_.likes++;
        hasLiked[msg.sender][_messageId] = true;
        totalLikes++;

        // Update author profile
        profiles[msg_.author].totalLikes++;

        emit MessageLiked(_messageId, msg.sender, msg_.likes);
    }

    /**
     * @notice Unlike a message
     * @param _messageId ID of the message to unlike
     */
    function unlikeMessage(uint256 _messageId) external messageExists(_messageId) {
        // Check if liked
        if (!hasLiked[msg.sender][_messageId]) revert NotLiked();

        Message storage msg_ = messages[_messageId];

        // Decrement likes
        msg_.likes--;
        hasLiked[msg.sender][_messageId] = false;
        totalLikes--;

        // Update author profile
        profiles[msg_.author].totalLikes--;

        emit MessageUnliked(_messageId, msg.sender, msg_.likes);
    }

    /**
     * @notice Toggle like on a message (like if not liked, unlike if liked)
     * @param _messageId ID of the message
     */
    function toggleLike(uint256 _messageId) external messageExists(_messageId) {
        if (hasLiked[msg.sender][_messageId]) {
            this.unlikeMessage(_messageId);
        } else {
            this.likeMessage(_messageId);
        }
    }

    // ============ View Functions ============

    /**
     * @notice Get a single message by ID
     * @param _messageId The message ID
     * @return The Message struct
     */
    function getMessage(uint256 _messageId) external view returns (Message memory) {
        if (!messages[_messageId].exists) revert MessageNotFound();
        return messages[_messageId];
    }

    /**
     * @notice Get recent messages with pagination
     * @param _offset Number of messages to skip
     * @param _limit Maximum number of messages to return
     * @return Array of Message structs
     */
    function getRecentMessages(
        uint256 _offset,
        uint256 _limit
    ) external view returns (Message[] memory) {
        uint256 total = messageIds.length;
        if (_offset >= total) return new Message[](0);

        uint256 end = _offset + _limit;
        if (end > total) end = total;
        uint256 resultCount = end - _offset;

        Message[] memory result = new Message[](resultCount);

        // Return in reverse order (newest first)
        for (uint256 i = 0; i < resultCount; i++) {
            uint256 idx = total - 1 - _offset - i;
            result[i] = messages[messageIds[idx]];
        }

        return result;
    }

    /**
     * @notice Get all messages (use carefully, can be gas-heavy)
     * @return Array of all messages in reverse order
     */
    function getAllMessages() external view returns (Message[] memory) {
        uint256 total = messageIds.length;
        Message[] memory result = new Message[](total);

        for (uint256 i = 0; i < total; i++) {
            result[i] = messages[messageIds[total - 1 - i]];
        }

        return result;
    }

    /**
     * @notice Get messages by a specific author
     * @param _author The author address
     * @return Array of Message structs
     */
    function getMessagesByAuthor(
        address _author
    ) external view returns (Message[] memory) {
        uint256 count = profiles[_author].messageCount;
        Message[] memory result = new Message[](count);
        uint256 idx = 0;

        for (uint256 i = messageIds.length; i > 0; i--) {
            Message storage msg_ = messages[messageIds[i - 1]];
            if (msg_.author == _author) {
                result[idx] = msg_;
                idx++;
            }
        }

        return result;
    }

    /**
     * @notice Check if a user has liked a message
     * @param _user The user address
     * @param _messageId The message ID
     * @return True if liked
     */
    function userHasLiked(
        address _user,
        uint256 _messageId
    ) external view returns (bool) {
        return hasLiked[_user][_messageId];
    }

    /**
     * @notice Get total message count
     * @return Number of messages posted
     */
    function getMessageCount() external view returns (uint256) {
        return messageCount;
    }

    /**
     * @notice Get total active authors count
     * @return Number of unique authors
     */
    function getAuthorCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= messageCount; i++) {
            if (profiles[messages[i].author].exists) {
                count++;
            }
        }
        return count;
    }

    /**
     * @notice Get author profile
     * @param _author The author address
     * @return AuthorProfile struct
     */
    function getAuthorProfile(
        address _author
    ) external view returns (AuthorProfile memory) {
        return profiles[_author];
    }

    // ============ Batch Operations ============

    /**
     * @notice Get multiple messages by IDs
     * @param _ids Array of message IDs
     * @return Array of Message structs
     */
    function getMessagesByIds(
        uint256[] calldata _ids
    ) external view returns (Message[] memory) {
        Message[] memory result = new Message[](_ids.length);

        for (uint256 i = 0; i < _ids.length; i++) {
            result[i] = messages[_ids[i]];
        }

        return result;
    }
}
